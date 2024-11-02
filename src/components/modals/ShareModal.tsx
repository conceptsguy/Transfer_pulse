import React, { useState } from 'react';
import { X, Copy, Mail, Link2, Check } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { users } from '../../data/users';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteLink] = useState('https://pulse.app/invite/abc123');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    // Handle invite logic here
    setEmail('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className={`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50
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
            <h2 className="text-lg font-semibold">Share Project</h2>
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

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Invite by Email */}
            <div>
              <h3 className={`text-sm font-medium mb-2
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
              >
                Invite team members
              </h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className={`flex-1 px-3 py-2 rounded-md border text-sm
                    ${isDarkMode 
                      ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={handleInvite}
                  disabled={!email.trim()}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${email.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : isDarkMode
                        ? 'bg-bolt-dark-hover text-bolt-dark-text-tertiary'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  Send
                </button>
              </div>
            </div>

            {/* Share Link */}
            <div>
              <h3 className={`text-sm font-medium mb-2
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
              >
                Share link
              </h3>
              <div className={`flex items-center gap-2 p-2 rounded-lg
                ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}
              >
                <Link2 
                  size={16} 
                  className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'} 
                />
                <span className={`flex-1 text-sm truncate
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}`}
                >
                  {inviteLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className={`p-1 rounded transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-bolt-dark-hover' 
                      : 'hover:bg-gray-200'}`}
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy 
                      size={16} 
                      className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'} 
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Current Members */}
            <div>
              <h3 className={`text-sm font-medium mb-2
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-700'}`}
              >
                Project members
              </h3>
              <div className="space-y-2">
                {users.slice(0, 3).map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-2 rounded-lg
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
                    <div className={`text-xs font-medium px-2 py-1 rounded
                      ${isDarkMode 
                        ? 'bg-bolt-dark-surface text-bolt-dark-text-secondary' 
                        : 'bg-gray-200 text-gray-600'}`}
                    >
                      {user.id === 'user1' ? 'Owner' : 'Editor'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;