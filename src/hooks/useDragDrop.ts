import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useWorkflowStore } from '../store/workflowStore';

export const useDragDrop = () => {
  const { project } = useReactFlow();
  const { addNode } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent, reactFlowBounds: DOMRect) => {
    event.preventDefault();

    try {
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const parsedData = JSON.parse(data);
      if (parsedData.type !== 'task') return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type: 'taskNode',
        position,
        data: parsedData.data
      };

      addNode(newNode);
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  }, [addNode, project]);

  return {
    onDragOver,
    onDrop,
  };
};