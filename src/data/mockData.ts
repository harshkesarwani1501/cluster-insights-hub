import { RawClusterData, ClusterData, ResourceAlert, parseClusterData } from '@/types/cluster';

// Raw K8s cluster data
const rawK8sClusters: RawClusterData[] = [
  {
    Cluster: "k8s-MV",
    Environment: "QAS",
    K8sVersion: "v1.31.4",
    WorkerNodes: "4",
    UsedPods: "222",
    PodCapacity: "800",
    HPA: "11",
    Namespaces: "17",
    Services: "99",
    Deployments: "90",
    CombinedCPU_Mem: "56/224649Mi",
    CordonNodes: "qamvk8sm1;qamvk8sm2;qamvk8sm3;",
    HighUsageNodes: { cpu: [], memory: [{ node: "qamlk8ss2", usage: 87 }] }
  },
  {
    Cluster: "K8S-RNL-DI",
    Environment: "QAS",
    K8sVersion: "v1.31.4",
    WorkerNodes: "4",
    UsedPods: "122",
    PodCapacity: "800",
    HPA: "7",
    Namespaces: "9",
    Services: "50",
    Deployments: "45",
    CombinedCPU_Mem: "56/224672Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [], memory: [] }
  },
  {
    Cluster: "k8s-prod-01",
    Environment: "Prod",
    K8sVersion: "v1.30.2",
    WorkerNodes: "12",
    UsedPods: "542",
    PodCapacity: "1200",
    HPA: "28",
    Namespaces: "45",
    Services: "189",
    Deployments: "156",
    CombinedCPU_Mem: "168/449298Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [{ node: "prod-worker-03", usage: 92 }], memory: [{ node: "prod-worker-03", usage: 88 }] }
  },
  {
    Cluster: "k8s-prod-02",
    Environment: "Prod",
    K8sVersion: "v1.30.2",
    WorkerNodes: "16",
    UsedPods: "678",
    PodCapacity: "1600",
    HPA: "35",
    Namespaces: "52",
    Services: "212",
    Deployments: "178",
    CombinedCPU_Mem: "224/598730Mi",
    CordonNodes: "prod-w2-node5;prod-w2-node8;",
    HighUsageNodes: { cpu: [], memory: [{ node: "prod-w2-node12", usage: 91 }] }
  },
  {
    Cluster: "k8s-dev-01",
    Environment: "Dev",
    K8sVersion: "v1.31.4",
    WorkerNodes: "6",
    UsedPods: "156",
    PodCapacity: "600",
    HPA: "12",
    Namespaces: "23",
    Services: "67",
    Deployments: "52",
    CombinedCPU_Mem: "84/149573Mi",
    CordonNodes: "dev-node-02;",
    HighUsageNodes: { cpu: [], memory: [] }
  },
  {
    Cluster: "k8s-dev-02",
    Environment: "Dev",
    K8sVersion: "v1.31.4",
    WorkerNodes: "4",
    UsedPods: "89",
    PodCapacity: "400",
    HPA: "8",
    Namespaces: "15",
    Services: "42",
    Deployments: "38",
    CombinedCPU_Mem: "56/99715Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [], memory: [] }
  },
];

// Raw AKS cluster data
const rawAKSClusters: RawClusterData[] = [
  {
    Cluster: "aks-prod-eastus-01",
    Environment: "Prod",
    K8sVersion: "v1.29.8",
    WorkerNodes: "10",
    UsedPods: "398",
    PodCapacity: "1000",
    HPA: "22",
    Namespaces: "38",
    Services: "145",
    Deployments: "112",
    CombinedCPU_Mem: "140/374415Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [{ node: "aks-nodepool1-vmss000003", usage: 89 }], memory: [] }
  },
  {
    Cluster: "aks-prod-westeu-01",
    Environment: "Prod",
    K8sVersion: "v1.29.8",
    WorkerNodes: "14",
    UsedPods: "520",
    PodCapacity: "1400",
    HPA: "30",
    Namespaces: "48",
    Services: "178",
    Deployments: "142",
    CombinedCPU_Mem: "196/524181Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [], memory: [{ node: "aks-pool1-vmss000008", usage: 85 }] }
  },
  {
    Cluster: "aks-qas-eastus-01",
    Environment: "QAS",
    K8sVersion: "v1.30.4",
    WorkerNodes: "6",
    UsedPods: "245",
    PodCapacity: "600",
    HPA: "14",
    Namespaces: "22",
    Services: "78",
    Deployments: "65",
    CombinedCPU_Mem: "84/224649Mi",
    CordonNodes: "aks-qas-node1;",
    HighUsageNodes: { cpu: [], memory: [{ node: "aks-qas-vmss000002", usage: 86 }] }
  },
  {
    Cluster: "aks-qas-sea-01",
    Environment: "QAS",
    K8sVersion: "v1.30.4",
    WorkerNodes: "5",
    UsedPods: "312",
    PodCapacity: "500",
    HPA: "11",
    Namespaces: "18",
    Services: "56",
    Deployments: "48",
    CombinedCPU_Mem: "70/187207Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [{ node: "aks-sea-vmss000001", usage: 96 }, { node: "aks-sea-vmss000002", usage: 91 }], memory: [{ node: "aks-sea-vmss000001", usage: 93 }] }
  },
  {
    Cluster: "aks-dev-westus-01",
    Environment: "Dev",
    K8sVersion: "v1.31.2",
    WorkerNodes: "4",
    UsedPods: "95",
    PodCapacity: "400",
    HPA: "6",
    Namespaces: "15",
    Services: "42",
    Deployments: "35",
    CombinedCPU_Mem: "56/149573Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [], memory: [] }
  },
  {
    Cluster: "aks-dev-central-01",
    Environment: "Dev",
    K8sVersion: "v1.31.2",
    WorkerNodes: "3",
    UsedPods: "67",
    PodCapacity: "300",
    HPA: "5",
    Namespaces: "12",
    Services: "32",
    Deployments: "28",
    CombinedCPU_Mem: "42/112179Mi",
    CordonNodes: "None",
    HighUsageNodes: { cpu: [], memory: [] }
  },
];

// Parse and export mock clusters
export const mockClusters: ClusterData[] = [
  ...rawK8sClusters.map(raw => parseClusterData(raw, 'K8s')),
  ...rawAKSClusters.map(raw => parseClusterData(raw, 'AKS')),
];

// Generate alerts from clusters with high usage nodes
export const mockAlerts: ResourceAlert[] = mockClusters
  .filter(c => c.highUsageNodes.cpu.length > 0 || c.highUsageNodes.memory.length > 0)
  .map(c => ({
    cluster: c.cluster,
    platform: c.platform,
    cpu: c.highUsageNodes.cpu,
    memory: c.highUsageNodes.memory,
  }));
