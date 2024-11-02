import React from 'react';
import { trades } from '../data/trades';

export default function TradePanel() {
  const onDragStart = (event: React.DragEvent, trade: typeof trades[number]) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: 'task',
      data: {
        label: `New ${trade.name} Task`,
        status: 'pending',
        trade: trade.name,
        tradeColor: trade.color
      }
    }));
  };

  return (
    <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-white text-lg font-semibold mb-4">Construction Trades</h2>
      <div className="space-y-2">
        {trades.map((trade) => (
          <div
            key={trade.id}
            draggable
            onDragStart={(e) => onDragStart(e, trade)}
            className="p-3 rounded-md cursor-move transition-colors"
            style={{ 
              backgroundColor: trade.color + '20',
              borderLeft: `4px solid ${trade.color}`
            }}
          >
            <span className="text-white">{trade.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}