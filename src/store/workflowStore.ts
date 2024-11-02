import { create } from 'zustand';
import { Connection, Edge, Node } from 'reactflow';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Zone {
  id: string;
  name: string;
  color: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  zones: Zone[];
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  zones: Zone[];
  selectedNodeId: string | null;
  selectedZoneId: string | null;
  isLeftPanelOpen: boolean;
  projectName: string;
  history: HistoryState[];
  currentHistoryIndex: number;
  isZoneMode: boolean;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  removeNode: (id: string) => void;
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedZoneId: (id: string | null) => void;
  toggleLeftPanel: () => void;
  setProjectName: (name: string) => void;
  addZone: (zone: Zone) => void;
  updateZone: (id: string, updates: Partial<Zone>) => void;
  removeZone: (id: string) => void;
  clearZones: () => void;
  setZoneMode: (isEnabled: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY_LENGTH = 50;

const createHistoryState = (state: Partial<WorkflowState>): HistoryState => ({
  nodes: state.nodes || [],
  edges: state.edges || [],
  zones: state.zones || [],
});

const saveToHistory = (state: WorkflowState): HistoryState[] => {
  const currentHistory = Array.isArray(state.history) ? state.history : [createHistoryState(state)];
  const newHistory = currentHistory.slice(0, state.currentHistoryIndex + 1);
  const historyState = createHistoryState(state);
  
  newHistory.push(historyState);
  
  if (newHistory.length > MAX_HISTORY_LENGTH) {
    newHistory.shift();
  }
  
  return newHistory;
};

const initialState: Partial<WorkflowState> = {
  nodes: [],
  edges: [],
  zones: [],
  selectedNodeId: null,
  selectedZoneId: null,
  isLeftPanelOpen: true,
  projectName: 'Untitled Project',
  history: [createHistoryState({})],
  currentHistoryIndex: 0,
  isZoneMode: false,
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      ...initialState as WorkflowState,

      addNode: (node) =>
        set(state => {
          const newNodes = [...state.nodes, node];
          return {
            nodes: newNodes,
            history: saveToHistory({ ...state, nodes: newNodes }),
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        }),

      updateNode: (id, updates) =>
        set(state => {
          const newNodes = state.nodes.map((node) =>
            node.id === id 
              ? { 
                  ...node,
                  ...updates,
                  data: { ...node.data, ...(updates.data || {}) }
                }
              : node
          );
          return {
            nodes: newNodes,
            history: saveToHistory({ ...state, nodes: newNodes }),
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        }),

      removeNode: (id) =>
        set(state => {
          const newNodes = state.nodes.filter((node) => node.id !== id);
          const newEdges = state.edges.filter(
            (edge) => edge.source !== id && edge.target !== id
          );
          return {
            nodes: newNodes,
            edges: newEdges,
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
            history: saveToHistory({ ...state, nodes: newNodes, edges: newEdges }),
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        }),

      setEdges: (edges) =>
        set(state => ({
          edges,
          history: saveToHistory({ ...state, edges }),
          currentHistoryIndex: state.currentHistoryIndex + 1
        })),

      addEdge: (edge) =>
        set(state => ({
          edges: [...state.edges, edge],
          history: saveToHistory({ ...state, edges: [...state.edges, edge] }),
          currentHistoryIndex: state.currentHistoryIndex + 1
        })),

      removeEdge: (id) =>
        set(state => {
          const newEdges = state.edges.filter((edge) => edge.id !== id);
          return {
            edges: newEdges,
            history: saveToHistory({ ...state, edges: newEdges }),
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        }),

      setSelectedNodeId: (id) => set({ selectedNodeId: id }),
      
      setSelectedZoneId: (id) => set({ selectedZoneId: id }),

      toggleLeftPanel: () =>
        set((state) => ({ isLeftPanelOpen: !state.isLeftPanelOpen })),

      setProjectName: (name) => set({ projectName: name }),

      addZone: (zone) =>
        set(state => ({
          zones: [...state.zones, zone],
          history: saveToHistory({ ...state, zones: [...state.zones, zone] }),
          currentHistoryIndex: state.currentHistoryIndex + 1
        })),

      updateZone: (id, updates) =>
        set(state => {
          const newZones = state.zones.map((zone) =>
            zone.id === id ? { ...zone, ...updates } : zone
          );
          return {
            zones: newZones,
            history: saveToHistory({ ...state, zones: newZones }),
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        }),

      removeZone: (id) =>
        set(state => {
          const newZones = state.zones.filter((zone) => zone.id !== id);
          return {
            zones: newZones,
            selectedZoneId: state.selectedZoneId === id ? null : state.selectedZoneId,
            history: saveToHistory({ ...state, zones: newZones }),
            currentHistoryIndex: state.currentHistoryIndex + 1
          };
        }),

      clearZones: () =>
        set(state => ({
          zones: [],
          selectedZoneId: null,
          history: saveToHistory({ ...state, zones: [] }),
          currentHistoryIndex: state.currentHistoryIndex + 1
        })),

      setZoneMode: (isEnabled) => set({ isZoneMode: isEnabled }),

      undo: () => set(state => {
        if (!get().canUndo()) return state;
        
        const newIndex = state.currentHistoryIndex - 1;
        const previousState = state.history[newIndex];
        
        return {
          ...state,
          nodes: previousState.nodes,
          edges: previousState.edges,
          zones: previousState.zones,
          currentHistoryIndex: newIndex
        };
      }),

      redo: () => set(state => {
        if (!get().canRedo()) return state;
        
        const newIndex = state.currentHistoryIndex + 1;
        const nextState = state.history[newIndex];
        
        return {
          ...state,
          nodes: nextState.nodes,
          edges: nextState.edges,
          zones: nextState.zones,
          currentHistoryIndex: newIndex
        };
      }),

      canUndo: () => {
        const state = get();
        return state.currentHistoryIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.currentHistoryIndex < state.history.length - 1;
      },
    }),
    {
      name: 'workflow-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        zones: state.zones,
        projectName: state.projectName,
        history: [createHistoryState(state)],
        currentHistoryIndex: 0,
      }),
    }
  )
);