import React from 'react';
import { MousePointer, Hand } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface InteractionControlsProps {
  mode: 'select' | 'pan';
  onModeChange: (mode: 'select' | 'pan') => void;
}

const InteractionControls: React.FC<InteractionControlsProps> = ({ mode, onModeChange }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onModeChange('select')}
        className={`p-2 rounded-lg transition-colors ${
          mode === 'select'
            ? isDarkMode
              ? 'bg-bolt-dark-hover text-bolt-dark-text-primary'
              : 'bg-gray-100 text-gray-900'
            : isDarkMode
              ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        title="Selection Mode"
      >
        <MousePointer size={20} />
      </button>
      <button
        onClick={() => onModeChange('pan')}
        className={`p-2 rounded-lg transition-colors ${
          mode === 'pan'
            ? isDarkMode
              ? 'bg-bolt-dark-hover text-bolt-dark-text-primary'
              : 'bg-gray-100 text-gray-900'
            : isDarkMode
              ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        title="Pan Mode"
      >
        <Hand size={20} />
      </button>
    </div>
  );
};

export default InteractionControls;