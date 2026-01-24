import { ClusterData } from '@/types/cluster';
import { Download, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ClusterTableProps {
  clusters: ClusterData[];
}

const statusStyles: Record<ClusterData['status'], string> = {
  Healthy: 'status-healthy',
  Attention: 'status-attention',
  Warning: 'status-warning',
  Critical: 'status-critical',
};

const getAllocationColor = (value: number) => {
  if (value >= 90) return 'text-critical font-semibold';
  if (value >= 75) return 'text-warning font-semibold';
  if (value >= 60) return 'text-attention';
  return 'text-success';
};

export const ClusterTable = ({ clusters }: ClusterTableProps) => {
  const [search, setSearch] = useState('');

  const filteredClusters = clusters.filter(
    (c) =>
      c.cluster.toLowerCase().includes(search.toLowerCase()) ||
      c.host.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = [
      'Platform',
      'Cluster',
      'Host',
      'Version',
      'Workers',
      'Cordoned',
      'Namespaces',
      'Services',
      'Deployments',
      'HPA Count',
      'Running Pods',
      'Max Pods',
      'Utilization %',
      'CPU Allocation %',
      'Memory Allocation %',
      'Status',
    ];
    const rows = filteredClusters.map((c) => [
      c.platform,
      c.cluster,
      c.host,
      c.version,
      c.workerNodes,
      c.cordonedNodes,
      c.namespaces,
      c.services,
      c.deployments,
      c.hpaCount,
      c.runningPods,
      c.maxPods,
      c.utilPercent,
      c.cpuAllocation,
      c.memAllocation,
      c.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clusters.csv';
    a.click();
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clusters or hosts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredClusters.length}</span> clusters
          </span>
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cluster</th>
              <th>Version</th>
              <th className="text-center">Workers</th>
              <th className="text-center">NS</th>
              <th className="text-center">Services</th>
              <th className="text-center">Deploys</th>
              <th className="text-center">HPA</th>
              <th className="text-center">Pods</th>
              <th className="text-center">Util %</th>
              <th className="text-center">CPU %</th>
              <th className="text-center">Mem %</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClusters.map((cluster) => (
              <tr key={cluster.cluster}>
                <td>
                  <div className="flex items-center gap-2">
                    {cluster.cordonedNodes > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="w-4 h-4 text-warning" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {cluster.cordonedNodes} cordoned node{cluster.cordonedNodes > 1 ? 's' : ''}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div>
                      <div className="font-medium text-foreground">{cluster.cluster}</div>
                      <div className="text-xs text-muted-foreground mono">{cluster.host}</div>
                    </div>
                  </div>
                </td>
                <td className="mono text-sm text-muted-foreground">v{cluster.version}</td>
                <td className="text-center font-medium">{cluster.workerNodes}</td>
                <td className="text-center">{cluster.namespaces}</td>
                <td className="text-center">{cluster.services}</td>
                <td className="text-center">{cluster.deployments}</td>
                <td className="text-center font-medium">{cluster.hpaCount}</td>
                <td className="text-center">
                  <span className="mono text-sm">
                    {cluster.runningPods}
                    <span className="text-muted-foreground">/{cluster.maxPods}</span>
                  </span>
                </td>
                <td className="text-center">
                  <span className={cluster.utilPercent > 80 ? 'text-critical font-bold' : cluster.utilPercent > 50 ? 'text-attention font-medium' : 'text-success'}>
                    {cluster.utilPercent}%
                  </span>
                </td>
                <td className="text-center">
                  <span className={getAllocationColor(cluster.cpuAllocation)}>
                    {cluster.cpuAllocation}%
                  </span>
                </td>
                <td className="text-center">
                  <span className={getAllocationColor(cluster.memAllocation)}>
                    {cluster.memAllocation}%
                  </span>
                </td>
                <td className="text-center">
                  <span className={`status-badge ${statusStyles[cluster.status]}`}>
                    {cluster.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
