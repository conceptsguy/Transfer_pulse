import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

interface Project {
  id: string;
  name: string;
  updatedAt: string;
}

interface ProjectMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Mock projects data - replace with actual data source
  const [projects] = useState<Project[]>([
    { id: '1', name: 'Construction Workflow', updatedAt: '2024-03-15T10:00:00Z' },
    { id: '2', name: 'Renovation Project', updatedAt: '2024-03-14T15:30:00Z' },
    { id: '3', name: 'Site Development', updatedAt: '2024-03-13T09:45:00Z' },
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      // Add project creation logic here
      setIsCreating(false);
      setNewProjectName('');
    }
  };

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
            <h2 className="text-lg font-semibold">Projects</h2>
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

          {/* Search and Create */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects"
                  className={`w-full pl-8 pr-3 py-1.5 text-sm rounded-md border
                    ${isDarkMode 
                      ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                <Search 
                  size={14} 
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2
                    ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-400'}`}
                />
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus size={14} />
                New Project
              </button>
            </div>

            {isCreating && (
              <div className={`mt-4 p-3 rounded-md border
                ${isDarkMode ? 'border-bolt-dark-border bg-bolt-dark-bg' : 'border-gray-200 bg-gray-50'}`}
              >
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  className={`w-full px-3 py-1.5 text-sm rounded-md border mb-3
                    ${isDarkMode 
                      ? 'bg-bolt-dark-surface border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewProjectName('');
                    }}
                    className={`px-3 py-1.5 text-sm rounded-md
                      ${isDarkMode 
                        ? 'text-bolt-dark-text-secondary hover:bg-bolt-dark-hover' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                    className={`px-3 py-1.5 text-sm rounded-md
                      ${newProjectName.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : isDarkMode
                          ? 'bg-bolt-dark-hover text-bolt-dark-text-tertiary'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                  >
                    Create Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Project List */}
          <div className="max-h-[400px] overflow-y-auto">
            {filteredProjects.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredProjects.map(project => (
                  <div
                    key={project.id}
                    className={`group p-4 flex items-center justify-between hover:bg-opacity-50
                      ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-50'}`}
                  >
                    <div>
                      <h3 className={`text-sm font-medium mb-1
                        ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                      >
                        {project.name}
                      </h3>
                      <p className={`text-xs
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                      >
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className={`p-1 rounded
                          ${isDarkMode 
                            ? 'hover:bg-bolt-dark-bg text-bolt-dark-text-secondary' 
                            : 'hover:bg-gray-200 text-gray-600'}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(project.id)}
                        className={`p-1 rounded text-red-500
                          ${isDarkMode ? 'hover:bg-bolt-dark-bg' : 'hover:bg-gray-200'}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {showDeleteConfirm === project.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-30"
                          onClick={() => setShowDeleteConfirm(null)}
                        />
                        <div className={`absolute right-4 mt-2 w-72 rounded-lg shadow-lg p-3 z-40
                          ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-white'}`}
                        >
                          <div className="flex items-start gap-2 mb-3">
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className={`text-sm font-medium mb-1
                                ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                              >
                                Delete "{project.name}"?
                              </h4>
                              <p className={`text-xs
                                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'}`}
                              >
                                This action cannot be undone.
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className={`px-2 py-1 text-xs rounded
                                ${isDarkMode 
                                  ? 'text-bolt-dark-text-secondary hover:bg-bolt-dark-hover' 
                                  : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                // Add delete logic here
                                setShowDeleteConfirm(null);
                              }}
                              className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-8 text-center
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
              >
                {searchQuery
                  ? `No projects found matching "${searchQuery}"`
                  : 'No projects yet'}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectMenu;