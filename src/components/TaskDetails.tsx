import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MoreVertical, Trash2, Copy, CheckCircle, Maximize2, Minimize2, Search, Plus, UserX, GripVertical } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useWorkflowStore } from '../store/workflowStore';
import { trades } from '../data/trades';
import { Edge, Node } from 'reactflow';
import confetti from 'canvas-confetti';

interface TaskDetailsProps {
  nodeId: string;
  node: Node;
  onClose: () => void;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  edges: Edge[];
  nodes: Node[];
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  nodeId,
  node,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  edges,
  nodes,
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { setEdges } = useWorkflowStore();
  const [newComment, setNewComment] = useState('');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAssigningUser, setIsAssigningUser] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [draggedSubtaskId, setDraggedSubtaskId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAssigningUser && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isAssigningUser]);

  const handleInputChange = (field: string, value: any) => {
    onUpdate(nodeId, {
      ...node.data,
      [field]: value
    });
  };

  const handleComplete = () => {
    onUpdate(nodeId, {
      ...node.data,
      status: 'completed',
      completion: 100
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comments = node.data.comments || [];
    handleInputChange('comments', [...comments, {
      id: Date.now(),
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      user: 'Current User'
    }]);
    setNewComment('');
  };

  const handleAssignUser = (user: any) => {
    const currentAssignees = node.data.assignees || [];
    if (!currentAssignees.some(a => a.id === user.id)) {
      handleInputChange('assignees', [...currentAssignees, user]);
    }
    setIsAssigningUser(false);
    setUserSearchQuery('');
  };

  const handleRemoveAssignee = (userId: string) => {
    const currentAssignees = node.data.assignees || [];
    handleInputChange('assignees', currentAssignees.filter(a => a.id !== userId));
  };

  const handleSubtaskDragStart = (e: React.DragEvent, subtaskId: string) => {
    setDraggedSubtaskId(subtaskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSubtaskDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedSubtaskId || draggedSubtaskId === targetId) return;

    const currentSubtasks = node.data.subtasks || [];
    const currentIndex = currentSubtasks.findIndex(t => t.id === draggedSubtaskId);
    const targetIndex = currentSubtasks.findIndex(t => t.id === targetId);
    
    if (currentIndex === -1 || targetIndex === -1) return;

    const newSubtasks = [...currentSubtasks];
    const [removed] = newSubtasks.splice(currentIndex, 1);
    newSubtasks.splice(targetIndex, 0, removed);

    onUpdate(nodeId, {
      data: { ...node.data, subtasks: newSubtasks }
    });
  };

  const handleSubtaskDragEnd = () => {
    setDraggedSubtaskId(null);
  };

  const handleRemoveRelatedTask = (relatedNodeId: string) => {
    // Remove all edges connected between these nodes
    const newEdges = edges.filter(edge => 
      !(edge.source === nodeId && edge.target === relatedNodeId) &&
      !(edge.source === relatedNodeId && edge.target === nodeId)
    );
    
    // Update edges in the workflow store
    setEdges(newEdges);
  };

  const relatedTasks = edges
    .filter(edge => edge.source === nodeId || edge.target === nodeId)
    .map(edge => {
      const relatedNodeId = edge.source === nodeId ? edge.target : edge.source;
      const relatedNode = nodes.find(n => n.id === relatedNodeId);
      const type = edge.source === nodeId ? 'succeeding' : 'preceding';
      return {
        id: `${type}-${edge.id}`,
        nodeId: relatedNodeId,
        name: relatedNode?.data.label,
        type
      };
    });

  const inputClasses = `w-full px-2 py-1.5 text-sm rounded-md border ${
    isDarkMode
      ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:outline-none focus:ring-1 ${
    isDarkMode ? 'focus:ring-bolt-dark-hover' : 'focus:ring-blue-500'
  }`;

  const labelClasses = `block text-xs font-medium mb-1 ${
    isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'
  }`;

  return (
    <div
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'w-96 h-full'} 
        border-l flex flex-col transition-all duration-300 
        ${isDarkMode ? 'bg-bolt-dark-surface border-bolt-dark-border' : 'bg-white border-gray-200'}`}
    >
      {/* Header */}
      <div className={`p-3 border-b ${
        isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-semibold ${
            isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'
          }`}>
            Task Details
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handleComplete}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${
                node.data.status === 'completed'
                  ? isDarkMode
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-green-50 text-green-600'
                  : isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={node.data.status === 'completed'}
            >
              <CheckCircle size={16} />
              {node.data.status === 'completed' ? 'Completed' : 'Complete'}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`p-1.5 rounded-lg ${
                  isDarkMode
                    ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <MoreVertical size={16} />
              </button>
              
              {isMoreMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMoreMenuOpen(false)}
                  />
                  <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg py-1 z-50
                    ${isDarkMode ? 'bg-bolt-dark-bg border border-bolt-dark-border' : 'bg-white border border-gray-200'}`}
                  >
                    <button
                      onClick={() => {
                        onDuplicate(nodeId);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm
                        ${isDarkMode 
                          ? 'text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                          : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Copy size={14} />
                      Duplicate Task
                    </button>
                    <button
                      onClick={() => {
                        onDelete(nodeId);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10`}
                    >
                      <Trash2 size={14} />
                      Delete Task
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg ${
                isDarkMode
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Task Name */}
        <div>
          <label className={labelClasses}>Task Name</label>
          <input
            type="text"
            value={node.data.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            value={node.data.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={2}
            className={`${inputClasses} resize-none`}
            placeholder="Enter task description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Start Date */}
          <div>
            <label className={labelClasses}>Start Date</label>
            <input
              type="date"
              value={node.data.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Duration */}
          <div>
            <label className={labelClasses}>Duration (days)</label>
            <input
              type="number"
              min="1"
              value={node.data.duration || ''}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || '')}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Trade Selection */}
          <div>
            <label className={labelClasses}>Trade</label>
            <select
              value={trades.find(t => t.name === node.data.trade)?.id || ''}
              onChange={(e) => {
                const selectedTrade = trades.find(t => t.id === e.target.value);
                if (selectedTrade) {
                  handleInputChange('trade', selectedTrade.name);
                  handleInputChange('tradeColor', selectedTrade.color);
                } else {
                  handleInputChange('trade', undefined);
                  handleInputChange('tradeColor', undefined);
                }
              }}
              className={inputClasses}
            >
              <option value="">No Trade</option>
              {trades.map(trade => (
                <option key={trade.id} value={trade.id}>
                  {trade.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className={labelClasses}>Status</label>
            <select
              value={node.data.status || 'pending'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className={inputClasses}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>

        {/* Completion Percentage */}
        <div>
          <label className={labelClasses}>Completion</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={node.data.completion || 0}
              onChange={(e) => handleInputChange('completion', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className={`text-sm ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}>
              {node.data.completion || 0}%
            </span>
          </div>
        </div>

        {/* Type */}
        <div>
          <label className={labelClasses}>Type</label>
          <div className={`flex items-center gap-2 mt-1
            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
          >
            <input
              type="checkbox"
              checked={node.data.isMilestone || false}
              onChange={(e) => handleInputChange('isMilestone', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Milestone</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t
        ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={`flex-1 ${inputClasses}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`p-1.5 rounded-md transition-colors ${
              newComment.trim()
                ? isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                : isDarkMode
                  ? 'bg-bolt-dark-bg text-bolt-dark-text-tertiary'
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;