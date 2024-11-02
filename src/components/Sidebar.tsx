import React, { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import TradeLibrary from './TradeLibrary';
import TemplateLibrary from './TemplateLibrary';

const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_WIDTH = 256;

const Sidebar = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [activeTab, setActiveTab] = useState<'trades' | 'templates'>('trades');
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`h-full border-r flex flex-col ${
          isDarkMode ? 'bg-bolt-dark-surface border-bolt-dark-border' : 'bg-white border-gray-200'
        }`}
        style={{ width: `${width}px` }}
      >
        {/* Tabs */}
        <div className={`p-2 border-b ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}>
          <div className={`inline-flex rounded-lg p-1 w-full
            ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-100'}`}
          >
            <button
              onClick={() => setActiveTab('trades')}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'trades'
                  ? isDarkMode
                    ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                    : 'bg-white text-gray-900 shadow-sm'
                  : isDarkMode
                    ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Trades
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === 'templates'
                  ? isDarkMode
                    ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                    : 'bg-white text-gray-900 shadow-sm'
                  : isDarkMode
                    ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Templates
            </button>
          </div>
        </div>

        {/* Content - Made scrollable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {activeTab === 'trades' ? <TradeLibrary /> : <TemplateLibrary />}
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`w-1 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500/50 transition-colors
          ${isResizing ? 'bg-blue-500/50' : 'bg-transparent'}`}
        onMouseDown={() => setIsResizing(true)}
      />
    </>
  );
};

export default Sidebar;