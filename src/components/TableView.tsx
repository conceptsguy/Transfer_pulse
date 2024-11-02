import React, { useState, useRef, useEffect } from 'react';
import { Edit2, MoreHorizontal, GripVertical, Check, ChevronDown, Trash2, PanelRightOpen, Archive, Copy } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useWorkflowStore } from '../store/workflowStore';
import { trades } from '../data/trades';
import TaskDetails from './TaskDetails';

interface Column {
  id: string;
  label: string;
  field: string;
  width: string;
}

const defaultColumns: Column[] = [
  { id: 'label', label: 'Task Name', field: 'label', width: 'min-w-[200px]' },
  { id: 'trade', label: 'Trade', field: 'trade', width: 'min-w-[120px]' },
  { id: 'status', label: 'Status', field: 'status', width: 'min-w-[120px]' },
  { id: 'duration', label: 'Duration', field: 'duration', width: 'min-w-[100px]' },
];

const TableView = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { nodes, edges, updateNode, removeNode, setEdges, selectedNodeId, setSelectedNodeId } = useWorkflowStore();
  const [editingCell, setEditingCell] = useState<{ nodeId: string; field: string; value: string } | null>(null);
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTradeDropdownOpen, setIsTradeDropdownOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  const handleEdit = (nodeId: string, field: string, value: string) => {
    setEditingCell({ nodeId, field, value: value || '' });
  };

  const handleEditSubmit = () => {
    if (!editingCell) return;

    updateNode(editingCell.nodeId, {
      data: {
        ...nodes.find(n => n.id === editingCell.nodeId)?.data,
        [editingCell.field]: editingCell.value
      }
    });
    setEditingCell(null);
  };

  const handleBulkDelete = () => {
    selectedNodes.forEach(nodeId => {
      removeNode(nodeId);
    });
    setSelectedNodes(new Set());
    setIsBulkActionsOpen(false);
  };

  const handleBulkDuplicate = () => {
    const newNodes = Array.from(selectedNodes).map(nodeId => {
      const originalNode = nodes.find(n => n.id === nodeId);
      if (originalNode) {
        return {
          ...originalNode,
          id: `node-${Date.now()}-${nodeId}`,
          position: {
            x: originalNode.position.x + 50,
            y: originalNode.position.y + 50,
          },
        };
      }
      return null;
    }).filter(Boolean);

    newNodes.forEach(node => {
      if (node) {
        updateNode(node.id, node);
      }
    });

    setSelectedNodes(new Set());
    setIsBulkActionsOpen(false);
  };

  const handleBulkStatus = (status: string) => {
    selectedNodes.forEach(nodeId => {
      updateNode(nodeId, {
        data: {
          ...nodes.find(n => n.id === nodeId)?.data,
          status
        }
      });
    });
    setIsStatusDropdownOpen(false);
  };

  const handleBulkTrade = (tradeName: string) => {
    const trade = trades.find(t => t.name === tradeName);
    if (!trade) return;

    selectedNodes.forEach(nodeId => {
      updateNode(nodeId, {
        data: {
          ...nodes.find(n => n.id === nodeId)?.data,
          trade: trade.name,
          tradeColor: trade.color
        }
      });
    });
    setIsTradeDropdownOpen(false);
  };

  return (
    <div className="relative flex-1 h-full">
      <div className={`h-full overflow-auto ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}>
        {selectedNodes.size > 0 && (
          <div className={`sticky top-0 z-10 p-2 border-b
            ${isDarkMode ? 'bg-bolt-dark-surface border-bolt-dark-border' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className={`text-sm ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}>
                {selectedNodes.size} item{selectedNodes.size > 1 ? 's' : ''} selected
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2
                      ${isDarkMode 
                        ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                        : 'hover:bg-gray-100 text-gray-900'}`}
                  >
                    Status
                    <ChevronDown size={14} />
                  </button>
                  {isStatusDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setIsStatusDropdownOpen(false)}
                      />
                      <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg py-1 z-20
                        ${isDarkMode ? 'bg-bolt-dark-bg border border-bolt-dark-border' : 'bg-white border border-gray-200'}`}
                      >
                        {['pending', 'in-progress', 'completed', 'delayed'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleBulkStatus(status)}
                            className={`w-full px-4 py-2 text-sm text-left capitalize
                              ${isDarkMode 
                                ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                                : 'hover:bg-gray-100 text-gray-900'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsTradeDropdownOpen(!isTradeDropdownOpen)}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2
                      ${isDarkMode 
                        ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                        : 'hover:bg-gray-100 text-gray-900'}`}
                  >
                    Trade
                    <ChevronDown size={14} />
                  </button>
                  {isTradeDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setIsTradeDropdownOpen(false)}
                      />
                      <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg py-1 z-20 max-h-64 overflow-y-auto
                        ${isDarkMode ? 'bg-bolt-dark-bg border border-bolt-dark-border' : 'bg-white border border-gray-200'}`}
                      >
                        {trades.map(trade => (
                          <button
                            key={trade.id}
                            onClick={() => handleBulkTrade(trade.name)}
                            className={`w-full px-4 py-2 text-sm text-left
                              ${isDarkMode 
                                ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                                : 'hover:bg-gray-100 text-gray-900'}`}
                          >
                            {trade.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleBulkDuplicate}
                  className={`p-1.5 rounded-md
                    ${isDarkMode 
                      ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                      : 'hover:bg-gray-100 text-gray-500'}`}
                  title="Duplicate"
                >
                  <Copy size={16} />
                </button>

                <button
                  onClick={handleBulkDelete}
                  className={`p-1.5 rounded-md text-red-500
                    ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'}`}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <table className="w-full min-w-[800px]">
          <thead>
            <tr className={isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}>
              <th className="w-8 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedNodes.size === nodes.length && nodes.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNodes(new Set(nodes.map(n => n.id)));
                    } else {
                      setSelectedNodes(new Set());
                    }
                  }}
                  className="rounded border-gray-300"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`sticky top-0 px-4 py-2 text-left text-xs font-medium select-none
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}
                    ${column.width}`}
                >
                  <div className="flex items-center gap-2 group">
                    <GripVertical 
                      size={14} 
                      className={`opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing
                        ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`}
                    />
                    {column.label}
                  </div>
                </th>
              ))}
              <th className="w-8 px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr 
                key={node.id}
                className={`border-t cursor-pointer select-none
                  ${isDarkMode 
                    ? 'border-bolt-dark-border hover:bg-bolt-dark-surface' 
                    : 'border-gray-200 hover:bg-gray-50'}
                  ${selectedNodes.has(node.id) 
                    ? isDarkMode
                      ? 'bg-bolt-dark-hover'
                      : 'bg-blue-50'
                    : ''
                  }`}
              >
                <td className="w-8 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedNodes.has(node.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedNodes);
                      if (e.target.checked) {
                        newSelected.add(node.id);
                      } else {
                        newSelected.delete(node.id);
                      }
                      setSelectedNodes(newSelected);
                    }}
                    className="rounded border-gray-300"
                  />
                </td>
                {columns.map((column) => (
                  <td key={`${node.id}-${column.id}`} className="px-4 py-2">
                    {editingCell?.nodeId === node.id && editingCell?.field === column.field ? (
                      <input
                        type="text"
                        value={editingCell.value}
                        onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                        onBlur={handleEditSubmit}
                        className={`w-full px-2 py-1 rounded text-sm
                          ${isDarkMode 
                            ? 'bg-bolt-dark-surface text-bolt-dark-text-primary border-bolt-dark-border' 
                            : 'bg-white text-gray-900 border-gray-200'
                          } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="flex items-center justify-between group cursor-pointer"
                        onClick={() => handleEdit(node.id, column.field, node.data[column.field] || '')}
                      >
                        <span className={`text-sm ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}>
                          {node.data[column.field]}
                        </span>
                        <Edit2 
                          size={14} 
                          className={`opacity-0 group-hover:opacity-100 transition-opacity
                            ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`}
                        />
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 w-8">
                  <button 
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-1 rounded-lg hover:bg-opacity-10 hover:bg-gray-500
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'}`}
                  >
                    <PanelRightOpen size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedNode && (
        <div className="absolute top-0 right-0 h-full">
          <TaskDetails
            nodeId={selectedNode.id}
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={(id, data) => updateNode(id, { data })}
            onDelete={removeNode}
            onDuplicate={(id) => {
              const nodeToDuplicate = nodes.find(n => n.id === id);
              if (nodeToDuplicate) {
                const newNode = {
                  ...nodeToDuplicate,
                  id: `node-${Date.now()}`,
                  position: {
                    x: nodeToDuplicate.position.x + 50,
                    y: nodeToDuplicate.position.y + 50,
                  },
                };
                updateNode(newNode.id, newNode);
              }
            }}
            edges={edges}
            nodes={nodes}
          />
        </div>
      )}
    </div>
  );
};

export default TableView;