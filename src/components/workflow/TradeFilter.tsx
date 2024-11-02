import React from 'react';
import { Filter } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface TradeFilterProps {
  selectedTrades: Set<string>;
  onTradeToggle: (tradeName: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
  trades: Array<{ id: string; name: string; color: string }>;
}

const TradeFilter: React.FC<TradeFilterProps> = ({
  selectedTrades,
  onTradeToggle,
  onClearAll,
  isOpen,
  onToggle,
  trades,
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${selectedTrades.size > 0
            ? isDarkMode
              ? 'bg-bolt-dark-hover text-bolt-dark-text-primary'
              : 'bg-blue-50 text-blue-600'
            : isDarkMode
              ? 'text-bolt-dark-text-secondary hover:bg-bolt-dark-hover' 
              : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <Filter size={16} />
        {selectedTrades.size > 0 ? (
          <span>{selectedTrades.size} selected</span>
        ) : (
          <span>Filter</span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={onToggle}
          />
          <div className={`absolute top-full right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden z-20
            ${isDarkMode ? 'bg-bolt-dark-bg border border-bolt-dark-border' : 'bg-white border border-gray-200'}`}
          >
            <div className={`p-3 border-b
              ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  Filter by Trade
                </h3>
                {selectedTrades.size > 0 && (
                  <button
                    onClick={onClearAll}
                    className={`text-xs
                      ${isDarkMode 
                        ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Clear all
                  </button>
                )}
              </div>
              <p className={`text-xs
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
              >
                Select trades to highlight specific activities
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              <div className="space-y-1">
                {trades.map(trade => {
                  const isSelected = selectedTrades.has(trade.name);
                  return (
                    <button
                      key={trade.id}
                      onClick={() => onTradeToggle(trade.name)}
                      className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors
                        ${isSelected
                          ? isDarkMode
                            ? 'bg-bolt-dark-hover'
                            : 'bg-blue-50'
                          : isDarkMode
                            ? 'hover:bg-bolt-dark-hover'
                            : 'hover:bg-gray-50'
                        }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: trade.color }}
                      />
                      <span className={`text-sm
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        {trade.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TradeFilter;