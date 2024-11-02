import React, { useState } from 'react';
import { X, Users, Calendar, Link2, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { users } from '../../data/users';

interface ProjectSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const integrations = [
  {
    id: 'procore',
    name: 'Procore',
    description: 'Connect your Procore projects to sync activities and updates',
    icon: 'https://assets.procore.com/images/procore_logo.png',
    connected: false
  },
  {
    id: 'p6',
    name: 'Oracle Primavera P6',
    description: 'Import and export schedules with P6 Enterprise',
    icon: 'https://www.oracle.com/a/ocom/img/primavera.png',
    connected: true
  },
  {
    id: 'msproject',
    name: 'Microsoft Project',
    description: 'Sync tasks and dependencies with MS Project',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Microsoft_Project_%282019%E2%80%93present%29.svg',
    connected: false
  }
];

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [activeTab, setActiveTab] = useState<'details' | 'users' | 'integrations'>('details');
  const [projectName, setProjectName] = useState('Construction Workflow');
  const [startDate, setStartDate] = useState('2024-03-15');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [projectUsers, setProjectUsers] = useState(users);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleRemoveUser = (userId: string) => {
    setProjectUsers(users => users.filter(u => u.id !== userId));
  };

  const filteredUsers = users.filter(user => 
    !projectUsers.some(u => u.id === user.id) &&
    (user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const handleAddUser = (user: typeof users[0]) => {
    setProjectUsers(prev => [...prev, user]);
    setIsAddingUser(false);
    setUserSearchQuery('');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className={`fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-3xl z-50
        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className={`relative m-[1px] rounded-lg shadow-2xl overflow-hidden
          ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b
            ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
          >
            <h2 className="text-lg font-semibold">Project Settings</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                  : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className={`px-4 pt-4 border-b
            ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
          >
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? isDarkMode
                      ? 'border-white text-white'
                      : 'border-gray-900 text-gray-900'
                    : isDarkMode
                      ? 'border-transparent text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Project Details
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? isDarkMode
                      ? 'border-white text-white'
                      : 'border-gray-900 text-gray-900'
                    : isDarkMode
                      ? 'border-transparent text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'integrations'
                    ? isDarkMode
                      ? 'border-white text-white'
                      : 'border-gray-900 text-gray-900'
                    : isDarkMode
                      ? 'border-transparent text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Integrations
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border text-sm
                      ${isDarkMode 
                        ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                        : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-sm text-red-500 hover:text-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Project
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                  >
                    Project Members ({projectUsers.length})
                  </h3>
                  <button
                    onClick={() => setIsAddingUser(true)}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                  >
                    <Plus size={16} />
                    Add Member
                  </button>
                </div>

                {isAddingUser && (
                  <div className={`p-4 rounded-lg border
                    ${isDarkMode ? 'border-bolt-dark-border bg-bolt-dark-bg' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search by name or email"
                      className={`w-full px-3 py-2 rounded-md border text-sm mb-3
                        ${isDarkMode 
                          ? 'bg-bolt-dark-surface border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      autoFocus
                    />

                    <div className={`max-h-48 overflow-y-auto rounded-md border
                      ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
                    >
                      {filteredUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleAddUser(user)}
                          className={`w-full flex items-center gap-3 p-2 text-left transition-colors
                            ${isDarkMode 
                              ? 'hover:bg-bolt-dark-hover border-b border-bolt-dark-border last:border-0' 
                              : 'hover:bg-gray-50 border-b border-gray-200 last:border-0'}`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className={isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}>
                              {user.name}
                            </div>
                            <div className={`text-xs ${
                              isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'
                            }`}>
                              {user.email}
                            </div>
                          </div>
                        </button>
                      ))}

                      {filteredUsers.length === 0 && (
                        <div className={`p-3 text-center text-sm
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                        >
                          No users found
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {projectUsers.map(user => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg
                        ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className={isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}>
                            {user.name}
                          </div>
                          <div className={`text-xs ${
                            isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'
                          }`}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className={`p-1 rounded hover:bg-opacity-10 hover:bg-gray-500
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {integrations.map(integration => (
                    <div
                      key={integration.id}
                      className={`flex items-center justify-between p-4 rounded-lg border
                        ${isDarkMode 
                          ? 'border-bolt-dark-border bg-bolt-dark-bg' 
                          : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={integration.icon}
                          alt={integration.name}
                          className="w-8 h-8 object-contain"
                        />
                        <div>
                          <h4 className={`font-medium ${
                            isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'
                          }`}>
                            {integration.name}
                          </h4>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'
                          }`}>
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          integration.connected
                            ? isDarkMode
                              ? 'bg-bolt-dark-surface text-bolt-dark-text-primary hover:bg-bolt-dark-hover'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 border-t
            ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
          >
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-md text-sm
                  ${isDarkMode 
                    ? 'text-bolt-dark-text-secondary hover:bg-bolt-dark-hover' 
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className={`fixed top-[30%] left-1/2 -translate-x-1/2 w-full max-w-md z-[60]
            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 to-pink-500" />
            <div className={`relative m-[1px] rounded-lg shadow-2xl p-6
              ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'
                  }`}>
                    This action cannot be undone. All project data, including tasks, 
                    dependencies, and comments will be permanently deleted.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`px-4 py-2 rounded-md text-sm
                    ${isDarkMode 
                      ? 'text-bolt-dark-text-secondary hover:bg-bolt-dark-hover' 
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add delete logic here
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-md text-sm text-white bg-red-500 hover:bg-red-600"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectSettings;