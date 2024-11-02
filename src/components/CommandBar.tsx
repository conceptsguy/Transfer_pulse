import React, { useState, useEffect, useRef } from 'react';
import { Command, Search, Plus, Download, Upload, Settings, Archive, Trash2, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useWorkflowStore } from '../store/workflowStore';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const addNode = useWorkflowStore((state) => state.addNode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandOption[] = [
    {
      id: 'new-task',
      label: 'Add New Task',
      icon: <Plus size={16} />,
      action: () => {
        addNode({
          id: `node-${Date.now()}`,
          type: 'taskNode',
          position: { x: 100, y: 100 },
          data: { label: 'New Task', status: 'pending' }
        });
        onClose();
      },
      keywords: ['create', 'task', 'activity', 'new']
    },
    {
      id: 'toggle-theme',
      label: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: isDarkMode ? <Sun size={16} /> : <Moon size={16} />,
      action: () => {
        toggleTheme();
        onClose();
      },
      keywords: ['theme', 'dark', 'light', 'mode', 'color']
    },
    {
      id: 'export',
      label: 'Export Workflow',
      icon: <Download size={16} />,
      action: () => {
        // TODO: Implement export
        onClose();
      },
      keywords: ['save', 'download']
    },
    {
      id: 'import',
      label: 'Import Workflow',
      icon: <Upload size={16} />,
      action: () => {
        // TODO: Implement import
        onClose();
      },
      keywords: ['load', 'upload']
    },
    {
      id: 'settings',
      label: 'Open Settings',
      icon: <Settings size={16} />,
      action: () => {
        // TODO: Implement settings
        onClose();
      }
    },
    {
      id: 'archive',
      label: 'Archive Project',
      icon: <Archive size={16} />,
      action: () => {
        // TODO: Implement archive
        onClose();
      }
    },
    {
      id: 'delete',
      label: 'Delete Project',
      icon: <Trash2 size={16} />,
      action: () => {
        // TODO: Implement delete
        onClose();
      },
      keywords: ['remove']
    }
  ];

  const filteredCommands = commands.filter(command => {
    const searchTerms = [
      command.label.toLowerCase(),
      ...(command.keywords || []).map(k => k.toLowerCase())
    ];
    return searchTerms.some(term => term.includes(searchQuery.toLowerCase()));
  });

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % filteredCommands.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
          break;
        case 'Enter':
          e.preventDefault();
          filteredCommands[selectedIndex]?.action();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

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
          <div className={`flex items-center gap-2 p-3 border-b
            ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
          >
            <Command size={16} className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search..."
              className={`flex-1 bg-transparent border-0 outline-none text-sm
                ${isDarkMode 
                  ? 'placeholder-bolt-dark-text-tertiary' 
                  : 'placeholder-gray-400'}`}
            />
            <kbd className={`px-2 py-0.5 text-xs rounded
              ${isDarkMode 
                ? 'bg-bolt-dark-bg text-bolt-dark-text-secondary' 
                : 'bg-gray-100 text-gray-500'}`}
            >
              ESC
            </kbd>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={command.action}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                  ${index === selectedIndex
                    ? isDarkMode 
                      ? 'bg-bolt-dark-hover' 
                      : 'bg-gray-100'
                    : 'hover:bg-opacity-50'
                  }`}
              >
                <span className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'}>
                  {command.icon}
                </span>
                <span>{command.label}</span>
              </button>
            ))}

            {filteredCommands.length === 0 && (
              <div className={`px-3 py-8 text-center text-sm
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
              >
                No commands found
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandBar;