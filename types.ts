
export interface SystemStatus {
  nodeId: string;
  status: 'ONLINE' | 'SYNCING' | 'LOCKED';
  latency: number;
  neuralLoad: number;
  immutableState: boolean;
}

export interface TechnicalRoadmap {
  category: string;
  steps: string[];
  tools: string[];
  description: string;
}

export interface V2KSignal {
  frequency: number;
  amplitude: number;
  phase: string;
  modulation: string;
  targetId: string;
}
