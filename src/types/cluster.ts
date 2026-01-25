export type PlatformType = 'K8s' | 'AKS';

export type EnvironmentType = 'Dev' | 'QAS' | 'Prod';

export interface HighUsageNode {
  node: string;
  usage: number;
}

export interface HighUsageNodes {
  cpu: HighUsageNode[];
  memory: HighUsageNode[];
}

// Raw data format from API
export interface RawClusterData {
  Cluster: string;
  Environment: string;
  K8sVersion: string;
  WorkerNodes: string;
  UsedPods: string;
  PodCapacity: string;
  HPA: string;
  Namespaces: string;
  Services: string;
  Deployments: string;
  CombinedCPU_Mem: string; // Format: "56/224649Mi"
  CordonNodes: string; // Semicolon-separated or "None"
  HighUsageNodes: HighUsageNodes;
}

// Parsed/processed data for display
export interface ClusterData {
  platform: PlatformType;
  cluster: string;
  environment: EnvironmentType;
  version: string;
  workerNodes: number;
  usedPods: number;
  podCapacity: number;
  hpaCount: number;
  namespaces: number;
  services: number;
  deployments: number;
  cpuAllocated: number;
  memAllocated: string; // Keep as string with unit (e.g., "224649Mi")
  cordonedNodes: string[]; // Array of node names
  highUsageNodes: HighUsageNodes;
  utilPercent: number;
  status: 'Healthy' | 'Attention' | 'Warning' | 'Critical';
}

export interface ResourceAlert {
  cluster: string;
  platform: PlatformType;
  cpu: HighUsageNode[];
  memory: HighUsageNode[];
}

export type FilterOption = 'All' | 'Dev' | 'QAS' | 'Prod';

// Helper function to parse raw data
export const parseClusterData = (raw: RawClusterData, platform: PlatformType): ClusterData => {
  const workerNodes = parseInt(raw.WorkerNodes, 10) || 0;
  const usedPods = parseInt(raw.UsedPods, 10) || 0;
  const podCapacity = parseInt(raw.PodCapacity, 10) || 0;
  const hpaCount = parseInt(raw.HPA, 10) || 0;
  const namespaces = parseInt(raw.Namespaces, 10) || 0;
  const services = parseInt(raw.Services, 10) || 0;
  const deployments = parseInt(raw.Deployments, 10) || 0;

  // Parse CombinedCPU_Mem (e.g., "56/224649Mi")
  const [cpuPart, memPart] = raw.CombinedCPU_Mem.split('/');
  const cpuAllocated = parseInt(cpuPart, 10) || 0;
  const memAllocated = memPart || '0Mi';

  // Parse CordonNodes
  const cordonedNodes = raw.CordonNodes === 'None' || !raw.CordonNodes
    ? []
    : raw.CordonNodes.split(';').filter(n => n.trim() !== '');

  // Calculate utilization
  const utilPercent = podCapacity > 0 ? Math.round((usedPods / podCapacity) * 100 * 10) / 10 : 0;

  // Determine status based on utilization and high usage nodes
  let status: ClusterData['status'] = 'Healthy';
  const hasHighUsage = raw.HighUsageNodes.cpu.length > 0 || raw.HighUsageNodes.memory.length > 0;
  
  if (utilPercent > 100 || raw.HighUsageNodes.cpu.some(n => n.usage >= 90) || raw.HighUsageNodes.memory.some(n => n.usage >= 90)) {
    status = 'Critical';
  } else if (utilPercent > 80 || hasHighUsage || cordonedNodes.length > 0) {
    status = 'Warning';
  } else if (utilPercent > 60) {
    status = 'Attention';
  }

  // Map environment
  const envMap: Record<string, EnvironmentType> = {
    'Dev': 'Dev',
    'DEV': 'Dev',
    'QAS': 'QAS',
    'Prod': 'Prod',
    'PROD': 'Prod',
  };

  return {
    platform,
    cluster: raw.Cluster,
    environment: envMap[raw.Environment] || 'Dev',
    version: raw.K8sVersion,
    workerNodes,
    usedPods,
    podCapacity,
    hpaCount,
    namespaces,
    services,
    deployments,
    cpuAllocated,
    memAllocated,
    cordonedNodes,
    highUsageNodes: raw.HighUsageNodes,
    utilPercent,
    status,
  };
};
