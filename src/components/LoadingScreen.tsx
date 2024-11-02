import React from 'react';
import { useThemeStore } from '../stores/themeStore';

const LoadingScreen = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className={`fixed inset-0 flex items-center justify-center
      ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}
    >
      <div className="relative">
        {/* Gradient ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-[spin_2s_linear_infinite]" />
        
        {/* Inner circle */}
        <div className={`relative m-1 w-12 h-12 rounded-full
          ${isDarkMode ? 'bg-bolt-dark-bg' : 'bg-gray-50'}`}
        >
          {/* Loading dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1">
              <div className={`w-1.5 h-1.5 rounded-full animate-[bounce_1s_infinite]
                ${isDarkMode ? 'bg-bolt-dark-text-secondary' : 'bg-gray-600'}`} 
                style={{ animationDelay: '0ms' }}
              />
              <div className={`w-1.5 h-1.5 rounded-full animate-[bounce_1s_infinite]
                ${isDarkMode ? 'bg-bolt-dark-text-secondary' : 'bg-gray-600'}`}
                style={{ animationDelay: '200ms' }}
              />
              <div className={`w-1.5 h-1.5 rounded-full animate-[bounce_1s_infinite]
                ${isDarkMode ? 'bg-bolt-dark-text-secondary' : 'bg-gray-600'}`}
                style={{ animationDelay: '400ms' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;