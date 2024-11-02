import React from 'react';
import { useThemeStore } from '../stores/themeStore';
import { users } from '../data/users';
import { 
  FileBox, 
  Users as UsersIcon,
  MessageSquare,
  Link,
  Edit2,
  Plus,
  Upload,
  ChevronDown,
  FileText
} from 'lucide-react';

const DashboardView: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Mock activity feed data
  const activityFeed = [
    {
      id: '1',
      user: users[0],
      type: 'status',
      action: 'marked',
      target: 'Foundation Pour',
      status: 'completed',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      user: users[1],
      type: 'assignment',
      action: 'assigned',
      target: 'Electrical Rough-in',
      assignee: users[2],
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      user: users[2],
      type: 'status',
      action: 'marked',
      target: 'Framing Inspection',
      status: 'delayed',
      reason: 'Waiting for additional materials to arrive',
      timestamp: '5 hours ago'
    },
    {
      id: '4',
      user: users[3],
      type: 'comment',
      action: 'commented on',
      target: 'HVAC Installation',
      comment: 'Ductwork installation will begin tomorrow morning',
      timestamp: '1 day ago'
    }
  ];

  // Mock BIM files data
  const bimFiles = [
    {
      id: '1',
      name: 'Architectural Model.rvt',
      size: '245 MB',
      updatedAt: '2 days ago'
    },
    {
      id: '2',
      name: 'MEP Coordination.nwd',
      size: '180 MB',
      updatedAt: '5 days ago'
    },
    {
      id: '3',
      name: 'Structural Analysis.ifc',
      size: '120 MB',
      updatedAt: '1 week ago'
    }
  ];

  return (
    <div className={`h-full overflow-y-auto ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Activity Feed */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className={`p-6 rounded-lg shadow-sm
              ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  Activity Feed
                </h2>
              </div>

              <div className="space-y-6">
                {activityFeed.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`flex gap-4 pb-6 border-b last:pb-0 last:border-0
                      ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
                  >
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`font-medium
                            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                          >
                            {activity.user.name}
                          </span>
                          <span className={`mx-1
                            ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                          >
                            {activity.action}
                          </span>
                          <span className={`font-medium
                            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                          >
                            {activity.target}
                          </span>
                        </div>
                        <span className={`text-xs
                          ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`}
                        >
                          {activity.timestamp}
                        </span>
                      </div>

                      {activity.type === 'status' && (
                        <div className={`mt-2 text-sm
                          ${activity.status === 'completed' 
                            ? 'text-green-500' 
                            : activity.status === 'delayed'
                              ? 'text-red-500'
                              : 'text-blue-500'
                          }`}
                        >
                          Status changed to {activity.status}
                          {activity.reason && (
                            <span className={`ml-1 ${
                              isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'
                            }`}>
                              - {activity.reason}
                            </span>
                          )}
                        </div>
                      )}

                      {activity.type === 'assignment' && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className={`text-sm
                            ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                          >
                            Assigned to
                          </div>
                          <img
                            src={activity.assignee.avatar}
                            alt={activity.assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className={`text-sm font-medium
                            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                          >
                            {activity.assignee.name}
                          </div>
                        </div>
                      )}

                      {activity.type === 'comment' && (
                        <div className={`mt-2 text-sm
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                        >
                          {activity.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Collaborators */}
            <div className={`p-6 rounded-lg shadow-sm
              ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  Collaborators
                </h2>
                <button
                  className={`p-1.5 rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                      : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {users.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className={`text-sm font-medium
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        {user.name}
                      </div>
                      <div className={`text-xs
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        {user.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BIM/VDC Files */}
            <div className={`p-6 rounded-lg shadow-sm
              ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-lg font-semibold
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  BIM/VDC Files
                </h2>
                <button
                  className={`p-1.5 rounded-lg transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                      : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Upload size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {bimFiles.map((file) => (
                  <div 
                    key={file.id}
                    className={`flex items-center gap-3 p-2 rounded-lg
                      ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-50'}`}
                  >
                    <FileBox 
                      size={32}
                      className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        {file.name}
                      </div>
                      <div className={`text-xs flex items-center gap-2
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;