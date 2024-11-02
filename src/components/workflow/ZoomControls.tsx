import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onFitView,
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`flex flex-col gap-2 p-2 rounded-lg shadow-lg
      ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
    >
      <button
        onClick={onZoomIn}
        className={`p-2 rounded-lg transition-colors
          ${isDarkMode 
            ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </button>
      <button
        onClick={onZoomOut}
        className={`p-2 rounded-lg transition-colors
          ${isDarkMode 
            ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>
      <button
        onClick={onFitView}
        className={`p-2 rounded-lg transition-colors
          ${isDarkMode 
            ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
        title="Fit View"
      >
        <Maximize size={16} />
      </button>
    </div>
  );
};

export default ZoomControls;