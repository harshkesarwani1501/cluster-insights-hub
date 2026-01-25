import { ClusterData } from '@/types/cluster';
import { Server, Box, Activity, AlertCircle, Cpu, HardDrive } from 'lucide-react';

interface StatsBarProps {
  clusters: ClusterData[];
}

export const StatsBar = ({ clusters }: StatsBarProps) => {
  const totalClusters = clusters.length;
  const totalPods = clusters.reduce((acc, c) => acc + c.usedPods, 0);
  const totalCapacity = clusters.reduce((acc, c) => acc + c.podCapacity, 0);
  const avgUtil = totalCapacity > 0 ? Math.round((totalPods / totalCapacity) * 100) : 0;
  
  // Count clusters with high usage nodes (alerts)
  const alertCount = clusters.filter(
    (c) => c.highUsageNodes.cpu.length > 0 || c.highUsageNodes.memory.length > 0
  ).length;
  
  // Total CPU and worker nodes
  const totalCpu = clusters.reduce((acc, c) => acc + c.cpuAllocated, 0);
  const totalWorkers = clusters.reduce((acc, c) => acc + c.workerNodes, 0);

  const stats = [
    {
      label: 'Clusters',
      value: totalClusters,
      icon: <Server className="w-4 h-4" />,
      color: 'text-primary',
    },
    {
      label: 'Workers',
      value: totalWorkers,
      icon: <Box className="w-4 h-4" />,
      color: 'text-success',
    },
    {
      label: 'Pods',
      value: `${totalPods.toLocaleString()}/${totalCapacity.toLocaleString()}`,
      icon: <Activity className="w-4 h-4" />,
      color: avgUtil > 80 ? 'text-critical' : avgUtil > 50 ? 'text-attention' : 'text-success',
    },
    {
      label: 'Utilization',
      value: `${avgUtil}%`,
      icon: <Cpu className="w-4 h-4" />,
      color: avgUtil > 80 ? 'text-critical' : avgUtil > 60 ? 'text-attention' : 'text-success',
    },
    {
      label: 'Total CPU',
      value: totalCpu,
      icon: <HardDrive className="w-4 h-4" />,
      color: 'text-primary',
    },
    {
      label: 'Alerts',
      value: alertCount,
      icon: <AlertCircle className="w-4 h-4" />,
      color: alertCount > 0 ? 'text-critical' : 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card p-4 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className={stat.color}>{stat.icon}</span>
            <span className="text-xs font-medium uppercase tracking-wide">{stat.label}</span>
          </div>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
