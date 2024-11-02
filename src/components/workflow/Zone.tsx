import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorkflowStore } from '../../store/workflowStore';
import { useReactFlow } from 'reactflow';
import { X } from 'lucide-react';

interface ZoneProps {
  id: string;
  name: string;
  color: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onSelect: () => void;
  isSelected: boolean;
}

const Zone: React.FC<ZoneProps> = ({
  id,
  name,
  color,
  position,
  onSelect,
  isSelected,
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { updateZone, removeZone } = useWorkflowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [zoneName, setZoneName] = useState(name);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const { getViewport } = useReactFlow();

  useEffect(() => {
    setZoneName(name);
  }, [name]);

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = position.width;
    const startHeight = position.height;
    const startLeft = position.x;
    const startTop = position.y;
    const { zoom } = getViewport();

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (direction.includes('e')) {
        newWidth = Math.max(100, startWidth + dx);
      }
      if (direction.includes('w')) {
        const deltaX = dx;
        newWidth = Math.max(100, startWidth - deltaX);
        newX = startLeft + deltaX;
      }
      if (direction.includes('s')) {
        newHeight = Math.max(100, startHeight + dy);
      }
      if (direction.includes('n')) {
        const deltaY = dy;
        newHeight = Math.max(100, startHeight - deltaY);
        newY = startTop + deltaY;
      }

      updateZone(id, {
        position: {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        }
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleNameSubmit = () => {
    if (zoneName.trim()) {
      updateZone(id, { name: zoneName.trim() });
      setIsEditing(false);
    } else {
      setZoneName(name);
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeZone(id);
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div
      className={`absolute rounded-lg border-2 transition-colors cursor-move
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isDarkMode ? 'bg-gray-800/20' : 'bg-gray-100/20'}`}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        borderColor: color,
        zIndex: isSelected ? 1 : 0,
        pointerEvents: 'all',
      }}
      onClick={handleZoneClick}
    >
      {/* Zone Label */}
      <div
        className={`absolute -top-7 left-0 flex items-center gap-2
          ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
      >
        {isEditing ? (
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameSubmit();
              if (e.key === 'Escape') {
                setZoneName(name);
                setIsEditing(false);
              }
            }}
            className={`px-2 py-1 text-sm rounded border
              ${isDarkMode 
                ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                : 'bg-white border-gray-300 text-gray-900'}`}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="px-2 py-1 rounded hover:bg-black/5 cursor-text"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {name}
            </div>
            {isSelected && (
              <button
                onClick={handleDelete}
                className={`p-1 rounded-lg hover:bg-black/10
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resize Handles - Only show when selected */}
      {isSelected && (
        <div className="absolute inset-0">
          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'se')}
          />

          {/* Edges */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-ns-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 's')}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-ew-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'w')}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-ew-resize bg-white/10"
            onMouseDown={(e) => handleMouseDown(e, 'e')}
          />
        </div>
      )}
    </div>
  );
};

export default Zone;