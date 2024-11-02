import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Edge,
  Connection,
  Node,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useThemeStore } from '../stores/themeStore';
import { useWorkflowStore } from '../store/workflowStore';
import TaskNode from './nodes/TaskNode';
import TaskDetails from './TaskDetails';
import ZoomControls from './workflow/ZoomControls';
import ActionBar from './workflow/ActionBar';
import LibraryModal from './modals/LibraryModal';
import Zone from './workflow/Zone';
import MultiSelectActions from './workflow/MultiSelectActions';

const nodeTypes = {
  taskNode: TaskNode,
};

const WorkflowCanvas = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { project } = useReactFlow();
  const {
    nodes,
    edges,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    setEdges,
    selectedNodeId,
    setSelectedNodeId,
    zones,
    selectedZoneId,
    setSelectedZoneId,
    updateZone,
    removeZone,
    addZone,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isZoneMode, setIsZoneMode] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  // Handle node dragging
  const onNodesChange = useCallback((changes: any[]) => {
    changes.forEach(change => {
      if (change.type === 'position' && 'position' in change) {
        updateNode(change.id, { position: change.position });
      } else if (change.type === 'select') {
        if (change.selected) {
          setSelectedNodes(prev => new Set([...prev, change.id]));
        } else {
          setSelectedNodes(prev => {
            const next = new Set(prev);
            next.delete(change.id);
            return next;
          });
        }
      }
    });
  }, [updateNode]);

  // Handle edge changes (deletion)
  const onEdgesChange = useCallback((changes: any[]) => {
    const newEdges = edges.filter(edge => 
      !changes.some(change => 
        change.id === edge.id && change.type === 'remove'
      )
    );
    setEdges(newEdges);
  }, [edges, setEdges]);

  // Handle new connections between nodes
  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const edgeId = `edge-${connection.source}-${connection.target}`;
    const newEdge: Edge = {
      id: edgeId,
      source: connection.source,
      target: connection.target,
      type: 'smoothstep',
      animated: false,
      style: { stroke: isDarkMode ? '#A3A3A3' : '#64748b', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };

    addEdge(newEdge);
  }, [addEdge, isDarkMode]);

  // Handle drag over for new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping new nodes
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!reactFlowWrapper.current) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const data = event.dataTransfer.getData('application/reactflow');
    
    try {
      const parsedData = JSON.parse(data);
      
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type: 'taskNode',
        position,
        data: parsedData.data,
      };

      addNode(newNode);
    } catch (error) {
      console.error('Error adding node:', error);
    }
  }, [project, addNode]);

  // Handle adding a new task manually
  const addNewTask = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'taskNode',
      position: { x: 100, y: 100 },
      data: { 
        label: 'New Task',
        status: 'pending',
        completion: 0,
        subtasks: []
      }
    };
    addNode(newNode);
  }, [addNode]);

  const handleZoom = useCallback((value: number) => {
    const { setViewport, getViewport } = useReactFlow();
    const currentViewport = getViewport();
    setViewport({ ...currentViewport, zoom: value });
  }, []);

  const handleCreateZoneFromSelection = useCallback(() => {
    if (selectedNodes.size === 0) return;

    // Calculate bounding box of selected nodes
    const selectedNodesList = nodes.filter(node => selectedNodes.has(node.id));
    const positions = selectedNodesList.map(node => ({
      x: node.position.x,
      y: node.position.y,
    }));

    const minX = Math.min(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxX = Math.max(...positions.map(p => p.x + 280)); // Assuming node width
    const maxY = Math.max(...positions.map(p => p.y + 150)); // Assuming node height

    // Add padding
    const padding = 50;
    const zoneData = {
      id: `zone-${Date.now()}`,
      name: 'New Zone',
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
      position: {
        x: minX - padding,
        y: minY - padding,
        width: maxX - minX + (padding * 2),
        height: maxY - minY + (padding * 2),
      },
    };

    addZone(zoneData);
    setSelectedNodes(new Set());
  }, [selectedNodes, nodes, addZone]);

  const handleBulkDelete = useCallback(() => {
    selectedNodes.forEach(nodeId => {
      removeNode(nodeId);
    });
    setSelectedNodes(new Set());
  }, [selectedNodes, removeNode]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setSelectedZoneId(null);
        }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: {
            strokeWidth: 2,
            stroke: isDarkMode ? '#A3A3A3' : '#64748b',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
        fitView
        className="touch-none"
      >
        <Background />

        {/* Action Bar */}
        <Panel position="left" className="absolute left-4 top-1/2 -translate-y-1/2">
          <ActionBar
            onOpenAI={() => {}}
            onAddActivity={addNewTask}
            onToggleLibrary={() => setIsLibraryOpen(!isLibraryOpen)}
            onToggleZoneMode={() => setIsZoneMode(!isZoneMode)}
            isZoneMode={isZoneMode}
          />
        </Panel>

        {/* Zoom Controls */}
        <Panel position="bottom-right" className="mb-4 mr-4">
          <ZoomControls
            onZoomIn={() => handleZoom(1.2)}
            onZoomOut={() => handleZoom(0.8)}
            onFitView={() => {}}
          />
        </Panel>

        {/* Zones */}
        {zones.map(zone => (
          <Zone
            key={zone.id}
            id={zone.id}
            name={zone.name}
            color={zone.color}
            position={zone.position}
            onSelect={() => setSelectedZoneId(zone.id)}
            isSelected={zone.id === selectedZoneId}
          />
        ))}
      </ReactFlow>

      {/* Task Details Panel */}
      {selectedNode && (
        <TaskDetails
          nodeId={selectedNode.id}
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onUpdate={(id, data) => updateNode(id, { data })}
          onDelete={removeNode}
          onDuplicate={(id) => {
            const nodeToDuplicate = nodes.find(n => n.id === id);
            if (nodeToDuplicate) {
              const newNode = {
                ...nodeToDuplicate,
                id: `node-${Date.now()}`,
                position: {
                  x: nodeToDuplicate.position.x + 50,
                  y: nodeToDuplicate.position.y + 50,
                },
              };
              addNode(newNode);
            }
          }}
          edges={edges}
          nodes={nodes}
        />
      )}

      {/* Library Modal */}
      {isLibraryOpen && (
        <LibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          anchorPosition={null}
        />
      )}

      {/* Multi-select Actions */}
      {selectedNodes.size > 1 && (
        <MultiSelectActions
          selectedCount={selectedNodes.size}
          onCreateZone={handleCreateZoneFromSelection}
          onBulkUpdate={() => {
            // TODO: Implement bulk update
            console.log('Bulk update');
          }}
          onDelete={handleBulkDelete}
        />
      )}
    </div>
  );
};

const WrappedWorkflowCanvas = () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);

export default WrappedWorkflowCanvas;