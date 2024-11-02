import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorkflowStore } from '../../store/workflowStore';
import { parseXER } from '../../utils/xerParser';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { addNode, addEdge } = useWorkflowStore();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processXERFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      if (!file.name.toLowerCase().endsWith('.xer')) {
        throw new Error('Please upload a valid XER file');
      }

      const activities = await parseXER(file);
      let baseX = 100;
      let baseY = 100;
      let lastNodeId: string | null = null;

      // Create nodes for each activity
      activities.forEach((activity, index) => {
        const nodeId = `node-${Date.now()}-${index}`;
        const newNode = {
          id: nodeId,
          type: 'taskNode',
          position: {
            x: baseX + (index * 250),
            y: baseY + (Math.floor(index / 5) * 150), // New row every 5 nodes
          },
          data: {
            label: activity.name,
            status: 'pending',
            description: activity.description,
            startDate: activity.startDate,
            duration: activity.duration,
          },
        };

        addNode(newNode);

        // Create edge if there's a predecessor
        if (lastNodeId) {
          const edgeId = `edge-${lastNodeId}-${nodeId}`;
          addEdge({
            id: edgeId,
            source: lastNodeId,
            target: nodeId,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: isDarkMode ? '#A3A3A3' : '#64748b',
              strokeWidth: 2,
            },
          });
        }

        lastNodeId = nodeId;
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process XER file');
    } finally {
      setIsProcessing(false);
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await processXERFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processXERFile(file);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className={`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50
        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className={`relative m-[1px] rounded-lg shadow-2xl overflow-hidden
          ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b
            ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
          >
            <h2 className="text-lg font-semibold">Import P6 XER File</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                  : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDarkMode 
                  ? isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-bolt-dark-border bg-bolt-dark-bg'
                  : isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <p className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}>
                    Processing XER file...
                  </p>
                </div>
              ) : (
                <>
                  <Upload 
                    size={32} 
                    className={`mx-auto mb-4 ${
                      isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'
                    }`} 
                  />
                  <p className={`text-sm mb-2 ${
                    isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'
                  }`}>
                    Drag and drop your P6 XER file here, or
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`text-sm font-medium text-blue-500 hover:text-blue-600
                      ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                  >
                    click to browse
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xer"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {error && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm
                ${isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'}`}
              >
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportModal;