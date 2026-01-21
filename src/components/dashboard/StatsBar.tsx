import { ClusterData } from '@/types/cluster';
import { Server, Box, AlertCircle, Activity } from 'lucide-react';

interface StatsBarProps {
  clusters: ClusterData[];
}

export const StatsBar = ({ clusters }: StatsBarProps) => {
  const totalClusters = clusters.length;
  const totalPods = clusters.reduce((acc, c) => acc + c.runningPods, 0);
  const criticalCount = clusters.filter((c) => c.status === 'Critical' || c.status === 'Warning').length;
  const avgUtil = Math.round(
    clusters.reduce((acc, c) => acc + c.utilPercent, 0) / clusters.length
  );

  const stats = [
    {
      label: 'Total Clusters',
      value: totalClusters,
      icon: <Server className="w-5 h-5" />,
      color: 'text-primary',
    },
    {
      label: 'Running Pods',
      value: totalPods.toLocaleString(),
      icon: <Box className="w-5 h-5" />,
      color: 'text-success',
    },
    {
      label: 'Needs Attention',
      value: criticalCount,
      icon: <AlertCircle className="w-5 h-5" />,
      color: criticalCount > 0 ? 'text-critical' : 'text-success',
    },
    {
      label: 'Avg Utilization',
      value: `${avgUtil}%`,
      icon: <Activity className="w-5 h-5" />,
      color: avgUtil > 80 ? 'text-warning' : 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
