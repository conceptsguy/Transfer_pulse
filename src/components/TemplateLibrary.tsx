import React, { useState, useMemo } from 'react';
import { Search, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { workflowTemplates } from '../data/templates';

const TemplateLibrary: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Residential', 'Renovation']);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return workflowTemplates;

    const query = searchQuery.toLowerCase().trim();
    return workflowTemplates.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedTemplates = useMemo(() => {
    const groups: { [key: string]: typeof workflowTemplates } = {};
    filteredTemplates.forEach(template => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  const onDragStart = (event: React.DragEvent, template: typeof workflowTemplates[0]) => {
    const data = {
      type: 'template',
      template: {
        ...template,
        tasks: template.tasks.map(task => ({
          ...task,
          id: undefined,
          status: 'pending'
        }))
      }
    };

    event.dataTransfer.setData('application/reactflow', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates"
            className={`w-full pl-7 pr-2 py-1 text-xs rounded-md border
              ${isDarkMode 
                ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary focus:border-bolt-dark-hover' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
              } focus:outline-none`}
          />
          <Search 
            size={12} 
            className={`absolute left-2 top-1/2 -translate-y-1/2 
              ${isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-500'}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="space-y-4">
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category} className="space-y-1">
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer
                  ${isDarkMode ? 'hover:bg-bolt-dark-hover' : 'hover:bg-gray-100'}`}
                onClick={() => toggleCategory(category)}
              >
                {expandedCategories.includes(category) 
                  ? <ChevronDown size={16} className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'} /> 
                  : <ChevronRight size={16} className={isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'} />
                }
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'
                }`}>
                  {category}
                </span>
              </div>

              {expandedCategories.includes(category) && (
                <div className="space-y-1 ml-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, template)}
                      className={`group p-3 rounded-md cursor-move
                        ${isDarkMode 
                          ? 'bg-bolt-dark-bg hover:bg-bolt-dark-hover' 
                          : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${
                          isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'
                        }`}>
                          {template.name}
                        </span>
                        <GripVertical 
                          size={14} 
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDarkMode ? 'text-bolt-dark-text-tertiary' : 'text-gray-500'
                          }`}
                        />
                      </div>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'
                      }`}>
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className={`px-4 py-3 text-sm ${
              isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-600'
            }`}>
              No templates found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;