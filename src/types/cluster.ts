export interface ClusterData {
  cluster: string;
  host: string;
  version: string;
  workerNodes: number;
  cordonedNodes: number;
  namespaces: number;
  services: number;
  deployments: number;
  runningPods: number;
  maxPods: number;
  utilPercent: number;
  status: 'Healthy' | 'Attention' | 'Warning' | 'Critical';
}

export interface ResourceAlert {
  cluster: string;
  cpu: { node: string; usage: number }[];
  memory: { node: string; usage: number }[];
}

export type FilterOption = 'All' | 'Dev' | 'QAS' | 'Table';
