import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  MoreHorizontal, 
  Link, 
  ChevronDown, 
  ChevronUp, 
  X, 
  GripVertical, 
  Plus,
  Copy,
  Edit2,
  Trash2
} from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorkflowStore } from '../../store/workflowStore';
import { User } from '../../types/workflow';
import confetti from 'canvas-confetti';

const isLightColor = (color: string) => {
  if (!color) return false;
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128;
};

const statusIcons = {
  pending: AlertCircle,
  'in-progress': Clock,
  completed: CheckCircle,
  delayed: AlertTriangle,
} as const;

interface TaskData {
  label: string;
  assignees?: User[];
  dueDate?: string;
  status: keyof typeof statusIcons;
  trade?: string;
  tradeColor?: string;
  isMilestone?: boolean;
  completion?: number;
  subtasks?: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
}

interface TaskNodeProps {
  id: string;
  data?: TaskData;
  selected?: boolean;
}

const TaskNode: React.FC<TaskNodeProps> = ({ id, data = { label: 'New Task', status: 'pending' }, selected = false }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { updateNode, removeNode } = useWorkflowStore();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Task');
  const [isHovered, setIsHovered] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [draggedSubtaskId, setDraggedSubtaskId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const CurrentStatusIcon = statusIcons[data.status || 'pending'];

  const handleStyle = {
    width: '12px',
    height: '12px',
    border: '2px solid',
    borderColor: data.tradeColor || (isDarkMode ? '#262626' : '#e5e7eb'),
    backgroundColor: isDarkMode ? '#141414' : '#ffffff',
    cursor: 'crosshair',
    borderRadius: '50%',
  };

  useEffect(() => {
    setLabel(data.label || 'New Task');
  }, [data.label]);

  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
      labelInputRef.current.select();
    }
  }, [isEditingLabel]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu && !nodeRef.current?.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const handleLabelSubmit = () => {
    if (label.trim()) {
      updateNode(id, {
        data: { ...data, label: label.trim() }
      });
    } else {
      setLabel(data.label || 'New Task');
    }
    setIsEditingLabel(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setLabel(data.label || 'New Task');
      setIsEditingLabel(false);
    }
    e.stopPropagation();
  };

  const handleSubtaskDragStart = (e: React.DragEvent, subtaskId: string) => {
    e.stopPropagation();
    setDraggedSubtaskId(subtaskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSubtaskDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedSubtaskId || draggedSubtaskId === targetId) return;

    const currentSubtasks = data.subtasks || [];
    const currentIndex = currentSubtasks.findIndex(t => t.id === draggedSubtaskId);
    const targetIndex = currentSubtasks.findIndex(t => t.id === targetId);
    
    if (currentIndex === -1 || targetIndex === -1) return;

    const newSubtasks = [...currentSubtasks];
    const [removed] = newSubtasks.splice(currentIndex, 1);
    newSubtasks.splice(targetIndex, 0, removed);

    updateNode(id, {
      data: { ...data, subtasks: newSubtasks }
    });
  };

  const handleSubtaskDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedSubtaskId(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = nodeRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setContextMenu({ x, y });
  };

  const getNodeStyle = () => {
    const baseStyle = {
      backgroundColor: isDarkMode ? '#141414' : '#ffffff',
      borderColor: data.tradeColor || (isDarkMode ? '#262626' : '#e5e7eb'),
      borderWidth: '2px',
    };

    if (data.status === 'delayed') {
      return {
        ...baseStyle,
        backgroundColor: isDarkMode ? '#1F1515' : '#FEE2E2',
        borderColor: '#EF4444',
      };
    }

    return baseStyle;
  };

  const getTradeTextColor = () => {
    if (!data.tradeColor) return isDarkMode ? 'text-white' : 'text-gray-900';
    return isLightColor(data.tradeColor) ? 'text-gray-900' : 'text-white';
  };

  const contextMenuItems = [
    {
      label: 'Copy',
      icon: <Copy size={14} />,
      onClick: () => {
        navigator.clipboard.writeText(JSON.stringify(data));
        setContextMenu(null);
      }
    },
    {
      label: 'Edit',
      icon: <Edit2 size={14} />,
      onClick: () => {
        setIsEditingLabel(true);
        setContextMenu(null);
      }
    },
    {
      label: 'Delete',
      icon: <Trash2 size={14} />,
      onClick: () => {
        removeNode(id);
        setContextMenu(null);
      },
      className: 'text-red-500 hover:bg-red-500/10'
    }
  ];

  return (
    <div ref={nodeRef} className="relative">
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />

      <div 
        className={`group rounded-2xl overflow-hidden shadow-lg transition-all
          ${selected ? 'ring-2 ring-blue-500' : ''} 
          hover:shadow-xl cursor-pointer w-[280px]
          ${isDarkMode ? 'shadow-black/20' : 'shadow-gray-200/50'}`}
        style={getNodeStyle()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        {data.trade && (
          <div 
            className={`px-3 py-1.5 text-sm font-medium ${getTradeTextColor()}`}
            style={{ 
              backgroundColor: data.tradeColor
            }}
          >
            {data.trade}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            {isEditingLabel ? (
              <input
                ref={labelInputRef}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleLabelSubmit}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className={`font-semibold text-xl px-2 py-1 rounded w-full
                  ${isDarkMode 
                    ? 'bg-bolt-dark-bg text-white' 
                    : 'bg-gray-100 text-gray-900'}`}
                autoFocus
              />
            ) : (
              <h3 
                className={`font-semibold text-xl cursor-text
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingLabel(true);
                }}
              >
                {label}
              </h3>
            )}
          </div>

          {data.description && (
            <p className={`text-sm mb-4 ${
              isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'
            }`}>
              {data.description}
            </p>
          )}
        </div>

        <div className={`h-1.5 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div 
            className={`h-full transition-all duration-300 ${
              data.status === 'delayed'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${data.completion || 0}%` }}
          />
        </div>

        <div className={`px-6 py-4 border-t flex items-center justify-between
          ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-2">
            <CurrentStatusIcon 
              className={`w-4 h-4 ${
                data.status === 'completed' ? 'text-green-500' :
                data.status === 'in-progress' ? 'text-blue-500' :
                data.status === 'delayed' ? 'text-red-500' :
                'text-yellow-500'
              }`} 
            />
            <div className={`text-sm font-medium
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {data.completion || 0}%
            </div>
          </div>

          <div className="flex items-center gap-4">
            {data.assignees && data.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {data.assignees.slice(0, 3).map((user, index) => (
                  <img
                    key={user.id}
                    src={user.avatar}
                    alt={user.name}
                    className={`w-6 h-6 rounded-full border-2 ${
                      isDarkMode ? 'border-bolt-dark-surface' : 'border-white'
                    }`}
                    title={user.name}
                  />
                ))}
                {data.assignees.length > 3 && (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                    ${isDarkMode 
                      ? 'bg-bolt-dark-bg border-bolt-dark-surface text-bolt-dark-text-secondary' 
                      : 'bg-gray-100 border-white text-gray-600'}`}
                  >
                    +{data.assignees.length - 3}
                  </div>
                )}
              </div>
            )}

            {data.subtasks && data.subtasks.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasks(!showSubtasks);
                }}
                className={`flex items-center gap-1 text-xs font-medium transition-colors
                  ${isDarkMode 
                    ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {data.subtasks.filter(t => t.completed).length}/{data.subtasks.length}
                {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {contextMenu && (
        <div 
          className={`absolute z-50 w-48 rounded-lg shadow-lg py-1
            ${isDarkMode ? 'bg-bolt-dark-bg border border-bolt-dark-border' : 'bg-white border border-gray-200'}`}
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          {contextMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full px-3 py-1.5 text-sm text-left flex items-center gap-2
                ${item.className || (isDarkMode 
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                  : 'hover:bg-gray-100 text-gray-900')}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {showSubtasks && data.subtasks && data.subtasks.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 space-y-1">
          {data.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              draggable
              onDragStart={(e) => handleSubtaskDragStart(e, subtask.id)}
              onDragOver={(e) => handleSubtaskDragOver(e, subtask.id)}
              onDragEnd={handleSubtaskDragEnd}
              className={`group flex items-center gap-2 p-2 rounded-md text-sm shadow-md
                ${isDarkMode 
                  ? 'bg-bolt-dark-surface hover:bg-bolt-dark-hover' 
                  : 'bg-white hover:bg-gray-50'}`}
            >
              <GripVertical 
                size={14} 
                className={`cursor-grab ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`} 
              />
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  const updatedSubtasks = data.subtasks?.map(t =>
                    t.id === subtask.id ? { ...t, completed: !t.completed } : t
                  );
                  updateNode(id, { data: { ...data, subtasks: updatedSubtasks } });
                }}
                className="rounded border-gray-300"
              />
              <span className={`flex-1 ${
                subtask.completed
                  ? isDarkMode 
                    ? 'line-through text-bolt-dark-text-tertiary' 
                    : 'line-through text-gray-400'
                  : isDarkMode
                    ? 'text-bolt-dark-text-primary'
                    : 'text-gray-900'
              }`}>
                {subtask.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedSubtasks = data.subtasks?.filter(t => t.id !== subtask.id);
                  updateNode(id, { data: { ...data, subtasks: updatedSubtasks } });
                }}
                className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                  ${isDarkMode 
                    ? 'hover:bg-bolt-dark-bg text-bolt-dark-text-tertiary hover:text-red-400' 
                    : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskNode;