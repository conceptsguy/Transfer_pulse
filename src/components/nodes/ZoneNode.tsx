import React, { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorkflowStore } from '../../store/workflowStore';

interface ZoneNodeProps {
  id: string;
  data: {
    name: string;
    color: string;
  };
  selected: boolean;
  dragging: boolean;
}

const ZoneNode: React.FC<ZoneNodeProps> = ({ id, data, selected, dragging }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { updateZone } = useWorkflowStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.name);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (name.trim()) {
      updateZone(id, { name: name.trim() });
      setIsEditing(false);
    } else {
      setName(data.name);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setName(data.name);
      setIsEditing(false);
    }
  };

  const handleResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = nodeRef.current?.offsetWidth || 0;
    const startHeight = nodeRef.current?.offsetHeight || 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!nodeRef.current) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) newWidth = Math.max(300, startWidth + deltaX);
      if (direction.includes('w')) newWidth = Math.max(300, startWidth - deltaX);
      if (direction.includes('s')) newHeight = Math.max(200, startHeight + deltaY);
      if (direction.includes('n')) newHeight = Math.max(200, startHeight - deltaY);

      nodeRef.current.style.width = `${newWidth}px`;
      nodeRef.current.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      if (nodeRef.current) {
        updateZone(id, {
          position: {
            width: nodeRef.current.offsetWidth,
            height: nodeRef.current.offsetHeight
          }
        });
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={nodeRef}
      className={`relative rounded-lg border-2 transition-colors ${
        selected ? 'shadow-lg' : ''
      } ${isDarkMode ? 'bg-gray-800/20' : 'bg-gray-100/20'} ${
        dragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        borderColor: data.color,
        minWidth: 300,
        minHeight: 200,
        width: '100%',
        height: '100%',
        opacity: dragging ? 0.8 : 1,
        position: 'relative',
        zIndex: 0,
      }}
    >
      {/* Zone content */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Resize borders */}
      <div className="absolute inset-0">
        {/* Top edge */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500/20" 
          style={{ zIndex: 1 }}
          onMouseDown={(e) => handleResize(e, 'n')} 
        />
        
        {/* Bottom edge */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500/20" 
          style={{ zIndex: 1 }}
          onMouseDown={(e) => handleResize(e, 's')} 
        />
        
        {/* Left edge */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/20" 
          style={{ zIndex: 1 }}
          onMouseDown={(e) => handleResize(e, 'w')} 
        />
        
        {/* Right edge */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/20" 
          style={{ zIndex: 1 }}
          onMouseDown={(e) => handleResize(e, 'e')} 
        />
      </div>

      {/* Zone name label */}
      <div
        className={`absolute top-0 left-0 px-3 py-1 rounded-tl-lg rounded-br-lg transition-colors ${
          selected ? 'shadow-md' : ''
        }`}
        style={{ 
          backgroundColor: `${data.color}40`,
          color: isDarkMode ? '#fff' : '#000',
          zIndex: 2
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={`text-sm font-medium px-2 py-0.5 rounded ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-white text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Zone name"
          />
        ) : (
          <span
            className="text-sm font-medium cursor-pointer hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {data.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default ZoneNode;