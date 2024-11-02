import React, { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '../../stores/themeStore';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I can help you with project updates, status checks, and identifying potential delays. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(input.trim()),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    // Mock AI responses based on keywords
    if (query.toLowerCase().includes('delay')) {
      return 'Based on current progress, the HVAC installation in the Renovation Project might face delays due to material delivery issues. I recommend following up with the supplier and considering alternative vendors.';
    } else if (query.toLowerCase().includes('status')) {
      return 'Currently, the Construction Workflow project is on track with 65% completion. The foundation work is completed, and electrical rough-in is in progress. The Site Development project needs attention as two tasks are marked as delayed.';
    } else if (query.toLowerCase().includes('update')) {
      return "Today's key updates:\n- Foundation inspection passed successfully\n- New permits approved for electrical work\n- Team meeting scheduled for tomorrow at 10 AM\n- 3 new tasks assigned to your team";
    } else {
      return 'I can help you with project status, delays, and updates. Feel free to ask specific questions about any project or task.';
    }
  };

  return (
    <div className="relative h-full">
      {/* Gradient border with fade effect */}
      <div className="absolute inset-0 rounded-lg" style={{
        background: `linear-gradient(to bottom, 
          rgba(59, 130, 246, 0.5) 0%, 
          rgba(147, 51, 234, 0.5) 25%, 
          rgba(236, 72, 153, 0.5) 50%, 
          rgba(236, 72, 153, 0) 100%)`
      }} />
      
      <div className={`relative m-[1px] rounded-lg shadow-sm overflow-hidden flex flex-col h-full
        ${isDarkMode ? 'bg-bolt-dark-surface' : 'bg-white'}`}
      >
        <div className={`p-6 border-b
          ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
        >
          <h2 className={`text-lg font-semibold
            ${isDarkMode ? 'text-bolt-dark-text-primary' : 'text-gray-900'}`}
          >
            AI Assistant
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white'
                  : isDarkMode
                    ? 'bg-bolt-dark-bg text-bolt-dark-text-primary'
                    : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm whitespace-pre-line">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user'
                    ? 'text-white/70'
                    : isDarkMode
                      ? 'text-bolt-dark-text-secondary'
                      : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`flex items-center gap-2 text-sm
              ${isDarkMode ? 'text-bolt-dark-text-secondary' : 'text-gray-500'}`}
            >
              <Loader2 size={16} className="animate-spin" />
              AI is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={`p-4 border-t flex gap-2
          ${isDarkMode ? 'border-bolt-dark-border' : 'border-gray-200'}`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about project status, delays, or updates..."
            className={`flex-1 px-3 py-2 rounded-md border text-sm
              ${isDarkMode 
                ? 'bg-bolt-dark-bg border-bolt-dark-border text-bolt-dark-text-primary placeholder-bolt-dark-text-tertiary' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-2 rounded-md transition-colors ${
              input.trim() && !isTyping
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90'
                : isDarkMode
                  ? 'bg-bolt-dark-bg text-bolt-dark-text-tertiary'
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;