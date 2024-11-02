export interface Trade {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  status: 'active' | 'inactive';
  currentTasks: string[];
}

export interface WorkflowNode {
  id: string;
  type: 'task' | 'condition' | 'approval';
  data: {
    label: string;
    assignees?: User[];
    dueDate?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'delayed';
    trade?: string;
    tradeColor?: string;
  };
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'hierarchy' | 'sequence';
  animated?: boolean;
  style?: object;
}

export type ConnectionType = 'hierarchy' | 'sequence';