import React, { useEffect, useRef, useMemo } from 'react';
import ForceGraph3D from '3d-force-graph';
import { useWorkflowStore } from '../store/workflowStore';
import { useThemeStore } from '../stores/themeStore';
import * as d3 from 'd3';

const ThreeDView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const { nodes, edges } = useWorkflowStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  // Memoize graph data to prevent unnecessary updates
  const graphData = useMemo(() => ({
    nodes: nodes.map(node => ({
      id: node.id,
      label: node.data.label,
      data: node.data,
    })),
    links: edges.filter(edge => 
      // Only include edges where both source and target nodes exist
      nodes.some(n => n.id === edge.source) && 
      nodes.some(n => n.id === edge.target)
    ).map(edge => ({
      source: edge.source,
      target: edge.target,
      value: 1
    }))
  }), [nodes, edges]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the graph
    const Graph = ForceGraph3D();
    graphRef.current = Graph(containerRef.current)
      .backgroundColor(isDarkMode ? '#0A0A0A' : '#ffffff')
      .nodeLabel(node => (node as any).label)
      .nodeColor(node => {
        const data = (node as any).data;
        if (data.tradeColor) return data.tradeColor;
        switch (data.status) {
          case 'completed': return '#22c55e';
          case 'in-progress': return '#3b82f6';
          case 'delayed': return '#ef4444';
          default: return '#f59e0b';
        }
      })
      .nodeVal(node => (node as any).data.isMilestone ? 20 : 10)
      .linkColor(() => isDarkMode ? '#404040' : '#e5e7eb')
      .linkWidth(2)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(2)
      .linkCurvature(0)
      .forceEngine('d3');

    // Configure forces for better linear layout
    const simulation = graphRef.current.d3Force();
    if (simulation) {
      simulation
        .force('link', d3.forceLink().id((d: any) => d.id)
          .distance(200)
          .strength(1)
        )
        .force('charge', d3.forceManyBody()
          .strength(-1000)
          .distanceMax(1000)
        )
        .force('x', d3.forceX()
          .strength(0.5)
          .x((d: any) => {
            const depth = calculateNodeDepth(d.id);
            return depth * 300;
          })
        )
        .force('y', d3.forceY()
          .strength(0.1)
          .y((d: any) => {
            const parallel = (d.data?.parallel || 0) * 150;
            return parallel;
          })
        )
        .force('z', d3.forceZ()
          .strength(0.05)
          .z(0)
        )
        .force('collision', d3.forceCollide()
          .radius(50)
          .strength(1)
        );
    }

    // Clean up
    return () => {
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, [isDarkMode]);

  // Calculate node's dependency depth
  const calculateNodeDepth = (nodeId: string): number => {
    const visited = new Set<string>();
    const getDepth = (id: string): number => {
      if (visited.has(id)) return 0;
      visited.add(id);
      
      const incomingEdges = edges.filter(edge => edge.target === id);
      if (incomingEdges.length === 0) return 0;

      const parentDepths = incomingEdges.map(edge => 
        getDepth(edge.source)
      );
      return Math.max(...parentDepths) + 1;
    };
    return getDepth(nodeId);
  };

  useEffect(() => {
    if (!graphRef.current) return;

    // Update graph data
    graphRef.current
      .graphData(graphData)
      .cameraPosition({ 
        x: 1000,
        y: 200,
        z: 1500
      },
      { x: 0, y: 0, z: 0 },
      3000
    );

  }, [graphData]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
    />
  );
};

export default ThreeDView;