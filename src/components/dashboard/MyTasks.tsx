import React from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { ArrowRight } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  project: string;
  startDate: string;
  duration: number;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

const MyTasks: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Mock tasks data
  const tasks: Task[] = [
    {
      id: '1',
      name: 'Review Foundation Plans',
      project: 'Construction Workflow',
      startDate: '2024-03-20',
      duration: 5,
      status: 'pending'
    },
    {
      id: '2',
      name: 'HVAC System Inspection',
      project: 'Renovation Project',
      startDate: '2024-03-21',
      duration: 3,
      status: 'in-progress'
    },
    {
      id: '3',
      name: 'Site Safety Audit',
      project: 'Site Development',
      startDate: '2024-03-19',
      duration: 2,
      status: 'delayed'
    },
    {
      id: '4',
      name: 'Electrical Permit Review',
      project: 'Construction Workflow',
      startDate: '2024-03-22',
      duration: 4,
      status: 'pending'
    }
  ];

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-50 text-green-600';
      case 'in-progress':
        return isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-600';
      case 'delayed':
        return isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-600';
      default:
        return isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-50 text-yellow-600';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden
      ${isDarkMode ? 'bg-bolt-dark-surface border border-bolt-dark-border' : 'bg-white'}`}
    >
      <div className={`p-6 border-b
        ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
      >
        <h2 className={`text-lg font-semibold
          ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
        >
          My Tasks
        </h2>
      </div>

      <div className={`divide-y ${isDarkMode ? 'divide-bolt-dark-border' : 'divide-gray-200'}`}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group p-4 transition-colors cursor-pointer
              ${isDarkMode 
                ? 'hover:bg-bolt-dark-hover' 
                : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className={`font-medium
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  {task.name}
                </div>
                <div className={`text-sm
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                >
                  {task.project}
                </div>
              </div>
              <ArrowRight 
                size={16} 
                className={`opacity-0 group-hover:opacity-100 transition-opacity
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'}`}
              />
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </div>
              <div className={`text-xs
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
              >
                Starts {new Date(task.startDate).toLocaleDateString()}
              </div>
              <div className={`text-xs
                ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
              >
                {task.duration} {task.duration === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasks;