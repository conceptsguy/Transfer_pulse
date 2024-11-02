import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import TradeLibrary from '../TradeLibrary';
import TemplateLibrary from '../TemplateLibrary';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorPosition: { x: number; y: number } | null;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, anchorPosition }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [activeTab, setActiveTab] = useState<'trades' | 'templates'>('trades');

  if (!isOpen || !anchorPosition) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div 
        className={`fixed z-50 w-80 rounded-lg shadow-xl
          ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          left: anchorPosition.x + 20, // 20px away from action bar
          height: '80vh', // Make it taller
          maxHeight: '800px'
        }}
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

        {/* Content */}
        <div className="h-[calc(100%-56px)] overflow-hidden">
          {activeTab === 'trades' ? <TradeLibrary /> : <TemplateLibrary />}
        </div>
      </div>
    </>
  );
};

export default LibraryModal;