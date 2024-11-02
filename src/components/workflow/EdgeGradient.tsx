import React from 'react';

interface EdgeGradientProps {
  isDarkMode: boolean;
  edges: any[];
  nodes: any[];
}

const EdgeGradient: React.FC<EdgeGradientProps> = ({ isDarkMode, edges, nodes }) => {
  // Create unique gradients for each edge based on source and target trade colors
  const gradients = edges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    const sourceColor = sourceNode?.data?.tradeColor || (isDarkMode ? '#666666' : '#94A3B8');
    const targetColor = targetNode?.data?.tradeColor || (isDarkMode ? '#A3A3A3' : '#64748B');
    
    return (
      <linearGradient 
        key={edge.id} 
        id={`edge-gradient-${edge.id}`} 
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor={sourceColor} stopOpacity={isDarkMode ? 0.6 : 0.8} />
        <stop offset="100%" stopColor={targetColor} stopOpacity={isDarkMode ? 0.6 : 0.8} />
      </linearGradient>
    );
  });

  // Add default gradients for new edges
  const defaultGradients = ['light', 'dark'].map(theme => (
    <linearGradient 
      key={`edge-gradient-${theme}`} 
      id={`edge-gradient-${theme}`} 
      gradientUnits="userSpaceOnUse"
    >
      <stop 
        offset="0%" 
        stopColor={theme === 'dark' ? '#666666' : '#94A3B8'} 
        stopOpacity={theme === 'dark' ? 0.6 : 0.8} 
      />
      <stop 
        offset="100%" 
        stopColor={theme === 'dark' ? '#A3A3A3' : '#64748B'} 
        stopOpacity={theme === 'dark' ? 0.6 : 0.8}
      />
    </linearGradient>
  ));

  return (
    <svg style={{ width: 0, height: 0 }}>
      <defs>
        {defaultGradients}
        {gradients}
      </defs>
    </svg>
  );
};

export default EdgeGradient;