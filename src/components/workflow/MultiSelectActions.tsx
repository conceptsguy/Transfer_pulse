import React from 'react';
import { FolderPlus, Trash2, Edit } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface MultiSelectActionsProps {
  selectedCount: number;
  onCreateZone: () => void;
  onBulkUpdate: () => void;
  onDelete: () => void;
}

const MultiSelectActions: React.FC<MultiSelectActionsProps> = ({
  selectedCount,
  onCreateZone,
  onBulkUpdate,
  onDelete,
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg z-50
      ${isDarkMode ? 'bg-bolt-dark-surface border border-bolt-dark-border' : 'bg-white border border-gray-200'}`}
    >
      <span className={`text-sm font-medium mr-2
        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
      >
        {selectedCount} items selected
      </span>
      
      <div className={`w-px h-4 mx-2
        ${isDarkMode ? 'bg-bolt-dark-border' : 'bg-gray-200'}`}
      />

      <button
        onClick={onCreateZone}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
          ${isDarkMode 
            ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
            : 'hover:bg-gray-100 text-gray-900'}`}
      >
        <FolderPlus size={16} />
        Group in Zone
      </button>

      <button
        onClick={onBulkUpdate}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors
          ${isDarkMode 
            ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
            : 'hover:bg-gray-100 text-gray-900'}`}
      >
        <Edit size={16} />
        Update All
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  );
};

export default MultiSelectActions;