import React, { useState } from 'react';
import { X, Camera, Mail, Phone, MapPin, Globe, Lock, Bell } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { users } from '../../data/users';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const currentUser = users[0]; // Using first user as current user for demo

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className={`fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50
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
            <h2 className="text-lg font-semibold">User Settings</h2>
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
                onClick={() => setActiveTab('profile')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? isDarkMode
                      ? 'border-white text-white'
                      : 'border-gray-900 text-gray-900'
                    : isDarkMode
                      ? 'border-transparent text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'notifications'
                    ? isDarkMode
                      ? 'border-white text-white'
                      : 'border-gray-900 text-gray-900'
                    : isDarkMode
                      ? 'border-transparent text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'security'
                    ? isDarkMode
                      ? 'border-white text-white'
                      : 'border-gray-900 text-gray-900'
                    : isDarkMode
                      ? 'border-transparent text-bolt-dark-text-secondary hover:text-bolt-dark-text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Security
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-24 h-24 rounded-full"
                    />
                    <button
                      className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg
                        ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-white'}`}
                    >
                      <Camera size={16} className="text-blue-500" />
                    </button>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      defaultValue="San Francisco, CA"
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border
                  ${isDarkMode ? 'border-bolt-dark-border bg-bolt-dark-bg' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium mb-1
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        Email Notifications
                      </h3>
                      <p className={`text-sm
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        Receive notifications about project updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-lg border
                  ${isDarkMode ? 'border-bolt-dark-border bg-bolt-dark-bg' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium mb-1
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        Desktop Notifications
                      </h3>
                      <p className={`text-sm
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        Show notifications on your desktop
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 rounded-md border text-sm
                      ${isDarkMode 
                        ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                        : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 rounded-md border text-sm
                      ${isDarkMode 
                        ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                        : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2 rounded-md border text-sm
                      ${isDarkMode 
                        ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
                        : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
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
    </>
  );
};

export default UserSettingsModal;