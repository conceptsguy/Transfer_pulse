import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useWorkflowStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 left-4 p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors z-50"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-200" />
      )}
    </button>
  );
}