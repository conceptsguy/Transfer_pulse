import { useMemo } from 'react';
import { Node } from 'reactflow';

export const useNodeFiltering = (nodes: Node[], selectedTrades: Set<string>) => {
  return useMemo(() => {
    if (selectedTrades.size === 0) {
      return nodes;
    }

    return nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: selectedTrades.has((node.data as any).trade) ? 1 : 0.2,
        transition: 'opacity 0.3s ease-in-out',
      },
    }));
  }, [nodes, selectedTrades]);
};

export default useNodeFiltering;