import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 left-4 p-2 rounded-full bg-opacity-80 backdrop-blur-sm"
      style={{ backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }}
    >
      {isDarkMode ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;