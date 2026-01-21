import { ClusterData, ResourceAlert } from '@/types/cluster';

const calculateStatus = (util: number): ClusterData['status'] => {
  if (util > 95) return 'Critical';
  if (util > 80) return 'Warning';
  if (util > 50) return 'Attention';
  return 'Healthy';
};

export const mockClusters: ClusterData[] = [
  {
    cluster: 'prod-cluster-01',
    host: 'k8s-prod-01.internal',
    version: '1.28.4',
    workerNodes: 12,
    cordonedNodes: 0,
    namespaces: 45,
    services: 128,
    deployments: 89,
    runningPods: 342,
    maxPods: 600,
    utilPercent: 57,
    status: 'Attention',
  },
  {
    cluster: 'dev-cluster-01',
    host: 'k8s-dev-01.internal',
    version: '1.29.1',
    workerNodes: 6,
    cordonedNodes: 1,
    namespaces: 23,
    services: 67,
    deployments: 45,
    runningPods: 156,
    maxPods: 300,
    utilPercent: 52,
    status: 'Attention',
  },
  {
    cluster: 'dev-cluster-02',
    host: 'k8s-dev-02.internal',
    version: '1.28.4',
    workerNodes: 4,
    cordonedNodes: 0,
    namespaces: 18,
    services: 34,
    deployments: 28,
    runningPods: 89,
    maxPods: 200,
    utilPercent: 44.5,
    status: 'Healthy',
  },
  {
    cluster: 'qas-cluster-01',
    host: 'k8s-qas-01.internal',
    version: '1.28.4',
    workerNodes: 8,
    cordonedNodes: 0,
    namespaces: 32,
    services: 95,
    deployments: 67,
    runningPods: 412,
    maxPods: 400,
    utilPercent: 103,
    status: 'Critical',
  },
  {
    cluster: 'qas-cluster-02',
    host: 'k8s-qas-02.internal',
    version: '1.29.0',
    workerNodes: 5,
    cordonedNodes: 0,
    namespaces: 15,
    services: 42,
    deployments: 31,
    runningPods: 178,
    maxPods: 250,
    utilPercent: 71.2,
    status: 'Attention',
  },
  {
    cluster: 'prod-cluster-02',
    host: 'k8s-prod-02.internal',
    version: '1.28.4',
    workerNodes: 16,
    cordonedNodes: 2,
    namespaces: 58,
    services: 189,
    deployments: 134,
    runningPods: 678,
    maxPods: 800,
    utilPercent: 84.75,
    status: 'Warning',
  },
];

export const mockAlerts: ResourceAlert[] = [
  {
    cluster: 'qas-cluster-01',
    cpu: [
      { node: 'worker-node-03', usage: 92 },
      { node: 'worker-node-05', usage: 87 },
    ],
    memory: [
      { node: 'worker-node-03', usage: 94 },
    ],
  },
  {
    cluster: 'prod-cluster-02',
    cpu: [
      { node: 'worker-node-12', usage: 88 },
    ],
    memory: [
      { node: 'worker-node-08', usage: 91 },
      { node: 'worker-node-12', usage: 85 },
    ],
  },
];
