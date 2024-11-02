import React from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { X, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

interface ZoneDetailsProps {
  zoneId: string;
  onClose: () => void;
}

const ZoneDetails: React.FC<ZoneDetailsProps> = ({ zoneId, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { zones, nodes, removeZone } = useWorkflowStore();

  const zone = zones.find(z => z.id === zoneId);
  if (!zone) return null;

  // Find nodes that are within the zone's boundaries
  const zoneNodes = nodes.filter(node => {
    const nodeX = node.position.x;
    const nodeY = node.position.y;
    return (
      nodeX >= zone.position.x &&
      nodeX <= zone.position.x + zone.position.width &&
      nodeY >= zone.position.y &&
      nodeY <= zone.position.y + zone.position.height
    );
  });

  return (
    <div className={`w-96 h-full border-l flex flex-col
      ${isDarkMode ? 'bg-bolt-dark-surface border-bolt-dark-border' : 'bg-white border-gray-200'}`}
    >
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between
        ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
      >
        <h2 className={`text-lg font-semibold
          ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
        >
          Zone Details
        </h2>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors
            ${isDarkMode 
              ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
              : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Zone Name */}
          <div>
            <label className={`block text-sm font-medium mb-2
              ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
            >
              Zone Name
            </label>
            <input
              type="text"
              value={zone.name}
              onChange={(e) => {
                // Update zone name logic
              }}
              className={`w-full px-3 py-2 rounded-md border text-sm
                ${isDarkMode 
                  ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Activities in Zone */}
          <div>
            <h3 className={`text-sm font-medium mb-3
              ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
            >
              Activities in Zone ({zoneNodes.length})
            </h3>
            <div className={`rounded-lg border overflow-hidden
              ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
            >
              {zoneNodes.length > 0 ? (
                <table className="w-full">
                  <thead className={isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}>
                    <tr className={`text-xs font-medium
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                    >
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Trade</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y
                    ${isDarkMode ? 'divide-bolt-dark-border' : 'divide-gray-200'}`}
                  >
                    {zoneNodes.map(node => (
                      <tr key={node.id}>
                        <td className={`px-4 py-2 text-sm
                          ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                        >
                          {node.data.label}
                        </td>
                        <td className={`px-4 py-2 text-sm
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                        >
                          {node.data.trade || '-'}
                        </td>
                        <td className={`px-4 py-2 text-sm
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                        >
                          {node.data.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={`px-4 py-8 text-center text-sm
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                >
                  No activities in this zone
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t
        ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
      >
        <button
          onClick={() => {
            removeZone(zoneId);
            onClose();
          }}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <Trash2 size={16} />
          <span>Delete Zone</span>
        </button>
      </div>
    </div>
  );
};

export default ZoneDetails;