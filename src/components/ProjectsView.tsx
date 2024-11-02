import React, { useState } from 'react';
import { Home, Inbox, FolderKanban, MessageSquareMore } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import WeekView from './WeekView';
import InboxView from './InboxView';
import { users } from '../data/users';
import UserSettingsModal from './modals/UserSettingsModal';
import MyTasks from './dashboard/MyTasks';
import AIChat from './dashboard/AIChat';

interface ProjectsViewProps {
  onProjectSelect: (projectId: string) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ onProjectSelect }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'inbox'>('home');
  const currentUser = users[0]; // Using first user as current user for demo

  // Mock projects data
  const projects = [
    { 
      id: '1', 
      name: 'Construction Workflow', 
      updatedAt: '2024-03-15T10:00:00Z',
      tasksCount: 24,
      milestonesCount: 5
    },
    { 
      id: '2', 
      name: 'Renovation Project', 
      updatedAt: '2024-03-14T15:30:00Z',
      tasksCount: 18,
      milestonesCount: 3
    },
    { 
      id: '3', 
      name: 'Site Development', 
      updatedAt: '2024-03-13T09:45:00Z',
      tasksCount: 32,
      milestonesCount: 7
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}>
      <UserSettingsModal isOpen={showUserSettings} onClose={() => setShowUserSettings(false)} />

      {/* Left Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-64 border-r
        ${isDarkMode ? 'bg-bolt-dark-surface border-bolt-dark-border' : 'bg-white border-gray-200'}`}
      >
        {/* User Profile */}
        <div className={`px-4 py-3 border-b
          ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
        >
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-bolt-dark-hover' 
                  : 'hover:bg-gray-100'}`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 text-left">
                <div className={`font-medium
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  {currentUser.name}
                </div>
                <div className={`text-xs truncate
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                >
                  {currentUser.email}
                </div>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className={`absolute left-0 right-0 mt-1 rounded-lg shadow-lg py-1 z-20
                  ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-white'}`}
                >
                  <button
                    onClick={() => {
                      setShowUserSettings(true);
                      setShowUserMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left
                      ${isDarkMode 
                        ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-primary' 
                        : 'hover:bg-gray-100 text-gray-900'}`}
                  >
                    Settings
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-2">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${currentView === 'home'
                ? isDarkMode
                  ? 'bg-bolt-dark-hover text-bolt-dark-text-primary'
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Home size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('inbox')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${currentView === 'inbox'
                ? isDarkMode
                  ? 'bg-bolt-dark-hover text-bolt-dark-text-primary'
                  : 'bg-gray-100 text-gray-900'
                : isDarkMode
                  ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Inbox size={18} />
            Inbox
          </button>
        </div>

        {/* Projects List */}
        <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}>
          <div className="px-4 mb-2">
            <h2 className={`text-xs font-medium uppercase
              ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
            >
              Projects
            </h2>
          </div>
          <div className="space-y-1 px-2">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isDarkMode 
                    ? 'text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <FolderKanban size={18} />
                {project.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {currentView === 'home' ? (
          <div className="p-6">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-semibold mb-2
                ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
              >
                Welcome back, {currentUser.name.split(' ')[0]}! 👋
              </h1>
              <p className={`text-sm
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}`}
              >
                Here's what's happening across your projects today.
              </p>
            </div>

            {/* Week View */}
            <WeekView tasks={[]} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* My Tasks */}
              <MyTasks />

              {/* AI Chat */}
              <AIChat />
            </div>
          </div>
        ) : (
          <InboxView />
        )}
      </div>
    </div>
  );
};

export default ProjectsView;