import { ClusterData } from '@/types/cluster';
import { Server, Box, Activity, AlertCircle, Cpu, HardDrive } from 'lucide-react';

interface StatsBarProps {
  clusters: ClusterData[];
}

export const StatsBar = ({ clusters }: StatsBarProps) => {
  const totalClusters = clusters.length;
  const totalPods = clusters.reduce((acc, c) => acc + c.runningPods, 0);
  const totalMaxPods = clusters.reduce((acc, c) => acc + c.maxPods, 0);
  const avgUtil = totalMaxPods > 0 ? Math.round((totalPods / totalMaxPods) * 100) : 0;
  const criticalCount = clusters.filter((c) => c.status === 'Critical' || c.status === 'Warning').length;
  const avgCpu = clusters.length > 0 ? Math.round(clusters.reduce((acc, c) => acc + c.cpuAllocation, 0) / clusters.length) : 0;
  const avgMem = clusters.length > 0 ? Math.round(clusters.reduce((acc, c) => acc + c.memAllocation, 0) / clusters.length) : 0;

  const stats = [
    {
      label: 'Clusters',
      value: totalClusters,
      icon: <Server className="w-4 h-4" />,
      color: 'text-primary',
    },
    {
      label: 'Pods',
      value: totalPods.toLocaleString(),
      icon: <Box className="w-4 h-4" />,
      color: 'text-success',
    },
    {
      label: 'Utilization',
      value: `${avgUtil}%`,
      icon: <Activity className="w-4 h-4" />,
      color: avgUtil > 80 ? 'text-critical' : avgUtil > 50 ? 'text-attention' : 'text-success',
    },
    {
      label: 'Avg CPU',
      value: `${avgCpu}%`,
      icon: <Cpu className="w-4 h-4" />,
      color: avgCpu > 80 ? 'text-critical' : avgCpu > 60 ? 'text-attention' : 'text-success',
    },
    {
      label: 'Avg Memory',
      value: `${avgMem}%`,
      icon: <HardDrive className="w-4 h-4" />,
      color: avgMem > 80 ? 'text-critical' : avgMem > 60 ? 'text-attention' : 'text-success',
    },
    {
      label: 'Attention',
      value: criticalCount,
      icon: <AlertCircle className="w-4 h-4" />,
      color: criticalCount > 0 ? 'text-critical' : 'text-success',
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
