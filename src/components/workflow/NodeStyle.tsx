import { Node } from 'reactflow';

export interface NodeStyleProps {
  selectedTrades: Set<string>;
}

export const useNodeStyle = ({ selectedTrades }: NodeStyleProps) => {
  return {
    nodeStyle: (node: Node) => {
      if (selectedTrades.size === 0) return {};

      const nodeTrade = node.data.trade;
      const isHighlighted = selectedTrades.has(nodeTrade);

      return {
        opacity: isHighlighted ? 1 : 0.2,
        filter: isHighlighted ? 'none' : 'grayscale(50%)',
        transition: 'all 0.3s ease-in-out',
      };
    }
  };
};