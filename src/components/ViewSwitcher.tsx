import React from 'react';
import { LayoutGrid, Table2, Box, LayoutDashboard, Sparkles } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import TradeFilter from './workflow/TradeFilter';
import AIChat from './dashboard/AIChat';

interface ViewSwitcherProps {
  currentView: 'canvas' | 'table' | '3d' | 'dashboard';
  onViewChange: (view: 'canvas' | 'table' | '3d' | 'dashboard') => void;
  nodes: any[];
  selectedTrades: Set<string>;
  onTradeToggle: (tradeName: string) => void;
  onClearTrades: () => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ 
  currentView, 
  onViewChange,
  nodes = [], 
  selectedTrades,
  onTradeToggle,
  onClearTrades,
  isFilterOpen,
  onFilterToggle
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [showAI, setShowAI] = React.useState(false);
  const usedTrades = new Set(nodes.filter(node => node?.data?.trade).map(node => node.data.trade));

  return (
    <div className={`h-12 px-4 border-b flex items-center
      ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
    >
      {/* Left Side */}
      <div className="w-1/3">
        <button
          onClick={() => setShowAI(!showAI)}
          className="px-4 py-1.5 rounded-md text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Sparkles size={16} />
          AI Assistant
        </button>
      </div>

      {/* Center - Tabs */}
      <div className="flex-1 flex justify-center">
        <div className={`inline-flex rounded-lg p-1
          ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-100'}`}
        >
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentView === 'dashboard'
                ? isDarkMode
                  ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDarkMode
                  ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>
          <button
            onClick={() => onViewChange('canvas')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentView === 'canvas'
                ? isDarkMode
                  ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDarkMode
                  ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <LayoutGrid size={16} />
            Canvas
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentView === 'table'
                ? isDarkMode
                  ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDarkMode
                  ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Table2 size={16} />
            Table
          </button>
          <button
            onClick={() => onViewChange('3d')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${currentView === '3d'
                ? isDarkMode
                  ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDarkMode
                  ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Box size={16} />
            3D
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/3 flex justify-end">
        {usedTrades.size > 0 && currentView !== 'dashboard' && (
          <TradeFilter
            selectedTrades={selectedTrades}
            onTradeToggle={onTradeToggle}
            onClearAll={onClearTrades}
            isOpen={isFilterOpen}
            onToggle={onFilterToggle}
            trades={Array.from(usedTrades).map(tradeName => ({
              id: tradeName,
              name: tradeName,
              color: '#000000' // You might want to get the actual color from your trades data
            }))}
          />
        )}
      </div>

      {/* AI Assistant Modal */}
      {showAI && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowAI(false)}
          />
          <div className="fixed left-5 top-[124px] h-[70vh] w-96 z-50">
            <AIChat />
          </div>
        </>
      )}
    </div>
  );
};

export default ViewSwitcher;