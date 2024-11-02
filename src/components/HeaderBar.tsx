import React, { useState } from 'react';
import { User, Moon, Sun, MoreVertical, Settings, Download, Upload, Archive, Trash2, ChevronLeft, Edit2, Activity } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import ImportModal from './modals/ImportModal';
import ProjectSettings from './modals/ProjectSettings';
import ShareModal from './modals/ShareModal';

interface HeaderBarProps {
  onOpenCommandBar: () => void;
  showProjectNav: boolean;
  onBackToProjects: () => void;
  projectId: string | null;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ 
  onOpenCommandBar, 
  showProjectNav,
  onBackToProjects,
  projectId 
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [projectName, setProjectName] = useState('Construction Workflow');
  const [isEditing, setIsEditing] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleSubmit = () => {
    if (projectName.trim()) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <>
      <header className={`h-12 border-b ${
        isDarkMode 
          ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showProjectNav ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onBackToProjects}
                  className={`flex items-center gap-1 text-sm font-medium hover:opacity-80
                    ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}`}
                >
                  <ChevronLeft size={16} />
                  Projects
                </button>
                <div className={`w-px h-4 ${isDarkMode ? 'bg-bolt-dark-border' : 'bg-gray-200'}`} />
                {isEditing ? (
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onBlur={handleSubmit}
                    onKeyDown={handleKeyDown}
                    className={`text-base font-medium px-2 py-1 rounded ${
                      isDarkMode
                        ? 'bg-bolt-dark-surface text-bolt-dark-text-primary'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="text-base font-medium">
                      {projectName}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity
                        ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'}`}
                    >
                      <Edit2 size={12} className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  <Activity size={16} className="text-white" />
                </div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Pulse
                </h1>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showProjectNav && (
              <>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  Share
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'
                    }`}
                  >
                    <MoreVertical size={14} className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'} />
                  </button>

                  {isMoreMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMoreMenuOpen(false)}
                      />
                      <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20
                        ${isDarkMode 
                          ? 'bg-bolt-dark-surface border border-bolt-dark-border' 
                          : 'bg-white border border-gray-200'}`}
                      >
                        <button
                          onClick={() => {
                            setIsSettingsOpen(true);
                            setIsMoreMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm
                            ${isDarkMode 
                              ? 'text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                              : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Settings size={14} />
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            setIsImportModalOpen(true);
                            setIsMoreMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm
                            ${isDarkMode 
                              ? 'text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                              : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Upload size={14} />
                          Import P6 XER
                        </button>
                        <button
                          onClick={() => {
                            // Add export logic
                            setIsMoreMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm
                            ${isDarkMode 
                              ? 'text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                              : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Download size={14} />
                          Export
                        </button>
                        <button
                          onClick={() => {
                            // Add archive logic
                            setIsMoreMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm
                            ${isDarkMode 
                              ? 'text-bolt-dark-text-primary hover:bg-bolt-dark-hover' 
                              : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <Archive size={14} />
                          Archive
                        </button>
                        <button
                          onClick={() => {
                            // Add delete logic
                            setIsMoreMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500
                            ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'}`}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            <button
              onClick={toggleTheme}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? (
                <Sun size={14} className="text-bolt-dark-text-secondary" />
              ) : (
                <Moon size={14} className="text-gray-600" />
              )}
            </button>

            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-bolt-dark-surface' : 'bg-gray-100'
            }`}>
              <User size={14} className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'} />
            </div>
          </div>
        </div>
      </header>

      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <ProjectSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default HeaderBar;