export type PlatformType = 'K8s' | 'AKS';

export interface ClusterData {
  platform: PlatformType;
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
  // New columns
  hpaCount: number;
  cpuAllocation: number; // percentage
  memAllocation: number; // percentage
}

export interface ResourceAlert {
  cluster: string;
  platform: PlatformType;
  cpu: { node: string; usage: number }[];
  memory: { node: string; usage: number }[];
}

export type FilterOption = 'All' | 'Dev' | 'QAS' | 'Prod';
