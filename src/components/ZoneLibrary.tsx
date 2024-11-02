import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeStore } from '../stores/themeStore';

interface Zone {
  id: string;
  name: string;
  color: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const ZoneLibrary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newZoneName, setNewZoneName] = useState('');
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const { zones, addZone, updateZone, removeZone } = useWorkflowStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const findClearPosition = () => {
    const zoneWidth = 400;
    const zoneHeight = 300;
    const padding = 100;
    
    const row = Math.floor(zones.length / 2);
    const col = zones.length % 2;
    
    const baseX = window.innerWidth / 2 - zoneWidth / 2;
    const baseY = window.innerHeight / 2 - zoneHeight / 2;
    
    const x = baseX + (col * (zoneWidth + padding)) - (zoneWidth + padding);
    const y = baseY + (row * (zoneHeight + padding)) - (zoneHeight + padding);

    return {
      x,
      y,
      width: zoneWidth,
      height: zoneHeight
    };
  };

  const handleAddZone = (name: string) => {
    if (name.trim()) {
      const position = findClearPosition();
      addZone({
        id: `zone-${Date.now()}`,
        name: name.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}80`,
        position
      });
      setNewZoneName('');
      setIsCreatingZone(false);
      
      setTimeout(() => {
        const reactFlowInstance = document.querySelector('.react-flow')
          ?.reactFlowInstance;
        if (reactFlowInstance) {
          reactFlowInstance.fitView({ padding: 0.2, duration: 800 });
        }
      }, 100);
    }
  };

  const handleNameChange = (zoneId: string, newName: string) => {
    updateZone(zoneId, { name: newName });
  };

  return (
    <div className="mb-4">
      <div
        className={`flex items-center justify-between p-2 cursor-pointer ${
          isDarkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <h3 className="text-lg font-semibold">Zones</h3>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-4 pr-2 space-y-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`group flex items-center gap-2 p-2 rounded ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <input
                type="text"
                value={zone.name}
                onChange={(e) => handleNameChange(zone.id, e.target.value)}
                className={`flex-1 px-2 py-1 text-sm rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-500' 
                    : 'bg-white border-gray-200 text-gray-700 focus:border-gray-400'
                } hover:border-opacity-100 focus:outline-none`}
              />
              <button
                onClick={() => removeZone(zone.id)}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded ${
                  isDarkMode 
                    ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {isCreatingZone ? (
            <div className="flex items-center gap-2 p-2">
              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddZone(newZoneName)}
                placeholder="Zone name"
                className={`flex-1 px-2 py-1 text-sm rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
                } focus:outline-none`}
                autoFocus
              />
              <button
                onClick={() => handleAddZone(newZoneName)}
                className={`p-1 rounded text-sm ${
                  newZoneName.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-gray-100 text-gray-400'
                }`}
                disabled={!newZoneName.trim()}
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingZone(true)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded w-full ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Plus size={16} />
              Add Zone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ZoneLibrary;