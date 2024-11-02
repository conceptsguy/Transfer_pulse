import React, { useState, useCallback } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { useWorkflowStore } from '../../store/workflowStore';
import { useReactFlow, useViewport } from 'reactflow';

interface ZoneCreatorProps {
  isActive: boolean;
  onComplete: () => void;
}

const ZoneCreator: React.FC<ZoneCreatorProps> = ({ isActive, onComplete }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { addZone } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  const handlePaneMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;

    const flowPos = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    setStartPos(flowPos);
    setCurrentPos(flowPos);
    setIsDrawing(true);
  }, [isActive, screenToFlowPosition]);

  const handlePaneMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;

    const flowPos = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    setCurrentPos(flowPos);
  }, [isDrawing, screenToFlowPosition]);

  const handlePaneMouseUp = useCallback(() => {
    if (!isDrawing) return;

    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    // Only create zone if it's big enough
    if (width > 50 && height > 50) {
      const zoneData = {
        id: `zone-${Date.now()}`,
        name: 'New Zone',
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
        position: {
          x: Math.min(startPos.x, currentPos.x),
          y: Math.min(startPos.y, currentPos.y),
          width,
          height,
        },
      };
      addZone(zoneData);
      onComplete(); // Switch back to select mode after creating zone
    }

    setIsDrawing(false);
  }, [isDrawing, startPos, currentPos, addZone, onComplete]);

  if (!isActive) return null;

  // Calculate preview box position in screen coordinates
  const left = Math.min(startPos.x, currentPos.x);
  const top = Math.min(startPos.y, currentPos.y);
  const width = Math.abs(currentPos.x - startPos.x);
  const height = Math.abs(currentPos.y - startPos.y);

  return (
    <div
      className="fixed inset-0 cursor-crosshair"
      style={{ zIndex: 5 }}
      onMouseDown={handlePaneMouseDown}
      onMouseMove={handlePaneMouseMove}
      onMouseUp={handlePaneMouseUp}
      onMouseLeave={handlePaneMouseUp}
    >
      {isDrawing && (
        <div
          className={`absolute pointer-events-none border-2 ${
            isDarkMode ? 'border-white/50 bg-white/10' : 'border-gray-900/50 bg-black/10'
          }`}
          style={{
            left,
            top,
            width,
            height,
          }}
        />
      )}
    </div>
  );
};

export default ZoneCreator;