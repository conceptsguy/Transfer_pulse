import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Search, Filter, MoreHorizontal, Star, Archive, CheckCircle2, MessageSquare, AlertCircle, UserPlus, AtSign } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  action: string;
  target: string;
  project: string;
  timestamp: string;
  comment?: string;
  details?: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  isRead?: boolean;
  isStarred?: boolean;
  type: 'comment' | 'status' | 'assignment' | 'mention' | 'approval';
}

const InboxView: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock activities data
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
      },
      type: 'comment',
      action: 'commented on',
      target: 'Foundation Plans',
      project: 'Construction Workflow',
      timestamp: '2 hours ago',
      comment: 'The revised foundation plans look good. Ready for final approval.',
      isRead: false,
      isStarred: true
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Michael Torres',
        email: 'michael.torres@example.com',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces'
      },
      type: 'status',
      action: 'marked',
      target: 'Electrical Rough-in',
      project: 'Renovation Project',
      timestamp: '3 hours ago',
      details: 'Status changed to Completed',
      isRead: true
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Alex Kim',
        email: 'alex.kim@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
      },
      type: 'assignment',
      action: 'assigned you to',
      target: 'HVAC Installation',
      project: 'Site Development',
      timestamp: '5 hours ago',
      isRead: false
    },
    {
      id: '4',
      user: {
        id: '4',
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces'
      },
      type: 'mention',
      action: 'mentioned you in',
      target: 'Plumbing Layout',
      project: 'Construction Workflow',
      timestamp: '1 day ago',
      comment: '@you Please review the updated plumbing layout for the second floor.',
      isRead: true
    }
  ]);

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === activities.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(activities.map(a => a.id)));
    }
  };

  const handleArchiveSelected = () => {
    // Add archive logic here
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    // Add delete logic here
    setSelectedItems(new Set());
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'status':
        return <AlertCircle size={16} className="text-green-500" />;
      case 'assignment':
        return <UserPlus size={16} className="text-purple-500" />;
      case 'mention':
        return <AtSign size={16} className="text-orange-500" />;
      case 'approval':
        return <CheckCircle2 size={16} className="text-teal-500" />;
      default:
        return null;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'unread' && activity.isRead) return false;
    if (filter === 'starred' && !activity.isStarred) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        activity.target.toLowerCase().includes(searchLower) ||
        activity.project.toLowerCase().includes(searchLower) ||
        activity.user.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b
        ${isDarkMode ? 'bg-bolt-dark-surface border-bolt-dark-border' : 'bg-white border-gray-200'}`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-xl font-semibold
              ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
            >
              Inbox
            </h1>
            <div className="flex items-center gap-2">
              {selectedItems.size > 0 && (
                <>
                  <button
                    onClick={handleArchiveSelected}
                    className={`p-2 rounded-lg transition-colors
                      ${isDarkMode 
                        ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                        : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className={`p-2 rounded-lg transition-colors text-red-500
                      ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className={`w-px h-4 mx-2
                    ${isDarkMode ? 'bg-bolt-dark-border' : 'bg-gray-200'}`}
                  />
                </>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1
                    ${isDarkMode 
                      ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                      : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Filter size={16} />
                  <span className="text-sm">Filter</span>
                </button>

                {showFilterMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterMenu(false)}
                    />
                    <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg py-1 z-20
                      ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-white'}`}
                    >
                      {['all', 'unread', 'starred'].map((f) => (
                        <button
                          key={f}
                          onClick={() => {
                            setFilter(f as typeof filter);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2
                            ${isDarkMode 
                              ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                              : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                          {filter === f && <CheckCircle2 size={14} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inbox"
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm
                ${isDarkMode 
                  ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <Search 
              size={16} 
              className={`absolute left-3 top-1/2 -translate-y-1/2
                ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`}
            />
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        <div className={`mx-6 my-4 rounded-lg overflow-hidden border
          ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
        >
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`group border-b last:border-b-0 transition-colors
                ${isDarkMode 
                  ? 'border-bolt-dark-border hover:bg-bolt-dark-hover' 
                  : 'border-gray-200 hover:bg-gray-50'}
                ${!activity.isRead 
                  ? isDarkMode
                    ? 'bg-bolt-dark-bg'
                    : 'bg-blue-50'
                  : isDarkMode
                    ? 'bg-bolt-dark-surface'
                    : 'bg-white'
                }`}
            >
              <div className="px-6 py-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(activity.id)}
                      onChange={() => handleSelectItem(activity.id)}
                      className="rounded border-gray-300"
                    />
                    <button
                      onClick={() => {
                        // Toggle star logic
                      }}
                      className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500
                        ${activity.isStarred ? 'text-yellow-500' : isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`}
                    >
                      <Star size={16} />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <img
                        src={activity.user.avatar}
                        alt={activity.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className={`font-medium truncate
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        {activity.user.name}
                      </div>
                      <div className={`text-sm
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        {activity.action}
                      </div>
                      <div className={`font-medium truncate
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        {activity.target}
                      </div>
                    </div>

                    {activity.comment && (
                      <p className={`text-sm mb-2
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}`}
                      >
                        {activity.comment}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {getActivityIcon(activity.type)}
                        <span className={`text-xs
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                        >
                          {activity.project}
                        </span>
                      </div>
                      <div className={`w-1 h-1 rounded-full
                        ${isDarkMode ? 'bg-bolt-dark-text-tertiary' : 'bg-gray-300'}`}
                      />
                      <span className={`text-xs
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                      ${isDarkMode 
                        ? 'hover:bg-bolt-dark-bg text-bolt-dark-text-secondary' 
                        : 'hover:bg-gray-100 text-gray-400'}`}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className={`px-6 py-8 text-center
              ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
            >
              {searchQuery
                ? `No activities found matching "${searchQuery}"`
                : 'No activities to show'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxView;