import { ClusterData } from '@/types/cluster';
import { Server, Box, Layers, GitBranch, AlertTriangle } from 'lucide-react';

interface ClusterCardProps {
  cluster: ClusterData;
}

const statusStyles: Record<ClusterData['status'], string> = {
  Healthy: 'status-healthy',
  Attention: 'status-attention',
  Warning: 'status-warning',
  Critical: 'status-critical',
};

const progressColors: Record<ClusterData['status'], string> = {
  Healthy: 'bg-success',
  Attention: 'bg-attention',
  Warning: 'bg-warning',
  Critical: 'bg-critical',
};

export const ClusterCard = ({ cluster }: ClusterCardProps) => {
  return (
    <div className="glass-card p-5 hover:border-primary/50 transition-all duration-300 hover:glow-primary group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {cluster.cluster}
          </h3>
          <p className="text-xs text-muted-foreground mono mt-1">
            {cluster.version}
          </p>
        </div>
        <span className={`status-badge ${statusStyles[cluster.status]}`}>
          {cluster.status}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Server className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Workers:</span>
          <span className="font-semibold text-foreground">{cluster.workerNodes}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">NS:</span>
          <span className="font-semibold text-foreground">{cluster.namespaces}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <GitBranch className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Services:</span>
          <span className="font-semibold text-foreground">{cluster.services}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Box className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Deploys:</span>
          <span className="font-semibold text-foreground">{cluster.deployments}</span>
        </div>
      </div>

      {/* Pod Utilization */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pod Utilization</span>
          <span className="font-semibold text-foreground">
            {cluster.usedPods} / {cluster.podCapacity}{' '}
            <span className="text-muted-foreground">({cluster.utilPercent}%)</span>
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${progressColors[cluster.status]}`}
            style={{ width: `${Math.min(cluster.utilPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Cordoned Warning */}
      {cluster.cordonedNodes.length > 0 && (
        <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-xs text-warning">
            {cluster.cordonedNodes.length} cordoned node{cluster.cordonedNodes.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};
