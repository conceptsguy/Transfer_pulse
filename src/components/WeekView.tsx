import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileBox, 
  Users as UsersIcon,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

interface Task {
  id: string;
  name: string;
  project: string;
  dueDate: string;
  time: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  type: 'milestone' | 'task' | 'meeting' | 'deadline';
  assignees?: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
}

interface WeekViewProps {
  tasks: Task[];
}

const getTypeIcon = (type: Task['type']) => {
  switch (type) {
    case 'milestone':
      return <CheckCircle2 size={14} className="text-purple-500" />;
    case 'meeting':
      return <UsersIcon size={14} className="text-blue-500" />;
    case 'deadline':
      return <AlertCircle size={14} className="text-red-500" />;
    default:
      return <FileBox size={14} className="text-green-500" />;
  }
};

const WeekView: React.FC<WeekViewProps> = ({ tasks }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Get current week dates based on offset
  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const today = new Date();

  // Format date range for header
  const formatDateRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const formatOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    
    return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}, ${start.getFullYear()}`;
  };

  // Mock data for demonstration
  const mockTasks: Task[] = [
    {
      id: '1',
      name: 'Foundation Inspection',
      project: 'Construction Workflow',
      dueDate: weekDates[1].toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'pending',
      type: 'milestone',
      assignees: [
        { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=faces' },
        { id: '2', name: 'Michael Torres', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=faces' }
      ]
    },
    {
      id: '2',
      name: 'Team Sync',
      project: 'All Projects',
      dueDate: weekDates[1].toISOString().split('T')[0],
      time: '2:00 PM',
      status: 'pending',
      type: 'meeting'
    },
    {
      id: '3',
      name: 'Electrical Rough-in',
      project: 'Renovation Project',
      dueDate: weekDates[2].toISOString().split('T')[0],
      time: '9:00 AM',
      status: 'in-progress',
      type: 'task',
      assignees: [
        { id: '3', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=faces' }
      ]
    },
    {
      id: '4',
      name: 'Permit Deadline',
      project: 'Site Development',
      dueDate: weekDates[3].toISOString().split('T')[0],
      time: '5:00 PM',
      status: 'delayed',
      type: 'deadline'
    },
    {
      id: '5',
      name: 'HVAC Installation',
      project: 'Construction Workflow',
      dueDate: weekDates[4].toISOString().split('T')[0],
      time: '11:00 AM',
      status: 'pending',
      type: 'task',
      assignees: [
        { id: '4', name: 'Emily Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces' },
        { id: '5', name: 'David Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces' }
      ]
    }
  ];

  // Group tasks by date
  const tasksByDate = weekDates.reduce((acc, date) => {
    const dateStr = date.toISOString().split('T')[0];
    acc[dateStr] = mockTasks.filter(task => task.dueDate === dateStr);
    return acc;
  }, {} as Record<string, Task[]>);

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
      ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
    >
      {/* Header */}
      <div className={`p-6 border-b
        ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-lg font-semibold
            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
          >
            Week Ahead
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className={`p-1.5 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                  : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                  : 'hover:bg-gray-100 text-gray-500'}`}
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className={`p-1.5 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-bolt-dark-hover text-bolt-dark-text-secondary' 
                  : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-sm
          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
        >
          <Calendar size={14} />
          {formatDateRange()}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`grid grid-cols-7 divide-x
        ${isDarkMode ? 'divide-bolt-dark-border' : 'divide-gray-200'}`}
      >
        {weekDates.map((date) => {
          const isToday = date.toDateString() === today.toDateString();
          const dateStr = date.toISOString().split('T')[0];
          const dayTasks = tasksByDate[dateStr] || [];

          return (
            <div
              key={dateStr}
              className={`min-h-[300px] ${
                isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'
              }`}
            >
              {/* Date Header */}
              <div className={`p-4 text-center border-b
                ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}
                ${isToday 
                  ? isDarkMode
                    ? 'bg-bolt-dark-hover'
                    : 'bg-blue-50'
                  : ''
                }`}
              >
                {/* Show full weekday name on larger screens, abbreviated on smaller */}
                <div className={`text-sm font-medium mb-1
                  ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                >
                  <span className="hidden sm:inline">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                  <span className="sm:hidden">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
                <div className={`text-lg font-semibold
                  ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                >
                  {date.getDate()}
                </div>
              </div>

              {/* Tasks */}
              <div className="p-2 space-y-2">
                {dayTasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className={`group p-3 rounded-lg cursor-pointer transition-transform hover:-translate-y-0.5
                      ${isDarkMode ? 'bg-bolt-dark-bg hover:bg-bolt-dark-hover' : 'bg-gray-50 hover:bg-gray-100'}
                      ${taskIndex > 0 ? '-mt-4' : ''}`}
                    style={{
                      zIndex: dayTasks.length - taskIndex,
                      position: 'relative'
                    }}
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {getTypeIcon(task.type)}
                        <div className={`text-sm font-medium truncate
                          ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
                        >
                          {task.name}
                        </div>
                      </div>
                      <ChevronRight size={14} className={`hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0
                        ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-400'}`}
                      />
                    </div>

                    {/* Project Name - Hide on smallest screens */}
                    <div className={`hidden xs:block text-xs mb-2 line-clamp-1
                      ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                    >
                      {task.project}
                    </div>

                    {/* Task Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Time - Hide on smallest screens */}
                        <div className={`hidden xs:flex items-center gap-1 text-xs
                          ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
                        >
                          <Clock size={12} />
                          {task.time}
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </div>
                      </div>

                      {/* Assignees - Hide on smaller screens */}
                      {task.assignees && task.assignees.length > 0 && (
                        <div className="hidden sm:flex -space-x-2">
                          {task.assignees.slice(0, 2).map((assignee) => (
                            <img
                              key={assignee.id}
                              src={assignee.avatar}
                              alt={assignee.name}
                              className={`w-6 h-6 rounded-full border-2 ${
                                isDarkMode ? 'border-bolt-dark-bg' : 'border-white'
                              }`}
                              title={assignee.name}
                            />
                          ))}
                          {task.assignees.length > 2 && (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                              ${isDarkMode 
                                ? 'bg-bolt-dark-hover border-bolt-dark-bg text-bolt-dark-text-secondary' 
                                : 'bg-gray-100 border-white text-gray-600'}`}
                            >
                              +{task.assignees.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;