import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useWorkflowStore } from '../store/workflowStore';
import { trades } from '../data/trades';

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { addNode, addEdge } = useWorkflowStore();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const createWorkflowFromPrompt = async (promptText: string) => {
    setIsProcessing(true);
    
    try {
      const tasks = promptText.split(' then ').map(task => task.trim());
      let lastNodeId: string | null = null;
      let baseY = window.innerHeight / 2 - 100;
      
      tasks.forEach((taskDescription, index) => {
        const matchedTrade = trades.find(trade => 
          taskDescription.toLowerCase().includes(trade.name.toLowerCase())
        );

        const nodeId = `node-${Date.now()}-${index}`;
        const newNode = {
          id: nodeId,
          type: 'taskNode',
          position: { 
            x: 100 + (index * 300), 
            y: baseY + (Math.random() * 50 - 25)
          },
          data: {
            label: taskDescription,
            status: 'pending',
            trade: matchedTrade?.name,
            tradeColor: matchedTrade?.color,
          }
        };

        addNode(newNode);

        if (lastNodeId) {
          const edgeId = `edge-${lastNodeId}-${nodeId}`;
          addEdge({
            id: edgeId,
            source: lastNodeId,
            target: nodeId,
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: isDarkMode ? '#A3A3A3' : '#64748b',
              strokeWidth: 2,
            },
            markerEnd: {
              type: 'arrowclosed',
            },
          });
        }

        lastNodeId = nodeId;
      });

      setPrompt('');
    } catch (error) {
      console.error('Error creating workflow:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      createWorkflowFromPrompt(prompt);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-96">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className={`relative m-[1px] rounded-lg shadow-xl
        ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-3 border-b
          ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
        >
          <h3 className={`text-sm font-medium
            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
          >
            Workflow Assistant
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors
              ${isDarkMode 
                ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="p-4">
          <p className={`text-xs mb-3
            ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}`}
          >
            Describe your workflow sequence using "then" between tasks.
            Example: "Excavate the site then pour foundation then frame walls"
          </p>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 pt-0">
          <div className={`flex gap-2 p-2 rounded-lg border
            ${isDarkMode ? 'bg-bolt-dark-bg border-bolt-dark-border' : 'bg-white border-gray-200'}`}
          >
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your workflow sequence..."
              className={`flex-1 resize-none text-sm bg-transparent border-0 
                focus:ring-0 focus:outline-none
                ${isDarkMode 
                  ? 'text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                  : 'text-gray-900 placeholder-gray-400'}`}
              rows={2}
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isProcessing}
              className={`self-end p-2 rounded-md transition-colors flex-shrink-0
                ${prompt.trim() && !isProcessing
                  ? isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  : isDarkMode
                    ? 'bg-bolt-dark-hover text-bolt-dark-text-tertiary'
                    : 'bg-gray-100 text-gray-400'
                }`}
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;