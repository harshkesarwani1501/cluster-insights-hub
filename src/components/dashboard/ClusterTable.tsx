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

  // Calculate totals
  const totals = filteredClusters.reduce(
    (acc, c) => ({
      workerNodes: acc.workerNodes + c.workerNodes,
      cordonedNodes: acc.cordonedNodes + c.cordonedNodes,
      namespaces: acc.namespaces + c.namespaces,
      services: acc.services + c.services,
      deployments: acc.deployments + c.deployments,
      hpaCount: acc.hpaCount + c.hpaCount,
      runningPods: acc.runningPods + c.runningPods,
      maxPods: acc.maxPods + c.maxPods,
      cpuAllocation: acc.cpuAllocation + c.cpuAllocation,
      memAllocation: acc.memAllocation + c.memAllocation,
    }),
    {
      workerNodes: 0,
      cordonedNodes: 0,
      namespaces: 0,
      services: 0,
      deployments: 0,
      hpaCount: 0,
      runningPods: 0,
      maxPods: 0,
      cpuAllocation: 0,
      memAllocation: 0,
    }
  );

  const avgCpuAllocation = filteredClusters.length > 0 ? Math.round(totals.cpuAllocation / filteredClusters.length) : 0;
  const avgMemAllocation = filteredClusters.length > 0 ? Math.round(totals.memAllocation / filteredClusters.length) : 0;
  const avgUtilPercent = totals.maxPods > 0 ? Math.round((totals.runningPods / totals.maxPods) * 100) : 0;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clusters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredClusters.length}</span> clusters
          </span>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 h-8 text-xs">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Table - compact fit */}
      <div className="w-full">
        <table className="data-table w-full table-fixed">
          <thead>
            <tr>
              <th className="w-[18%]">Cluster</th>
              <th className="w-[7%] text-center">Ver</th>
              <th className="w-[5%] text-center">Wrk</th>
              <th className="w-[5%] text-center">NS</th>
              <th className="w-[5%] text-center">Svc</th>
              <th className="w-[5%] text-center">Dply</th>
              <th className="w-[5%] text-center">HPA</th>
              <th className="w-[10%] text-center">Pods</th>
              <th className="w-[6%] text-center">Util</th>
              <th className="w-[6%] text-center">CPU</th>
              <th className="w-[6%] text-center">Mem</th>
              <th className="w-[10%] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClusters.map((cluster) => (
              <tr key={cluster.cluster}>
                <td className="truncate">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {cluster.cordonedNodes > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {cluster.cordonedNodes} cordoned node{cluster.cordonedNodes > 1 ? 's' : ''}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-sm truncate">{cluster.cluster}</div>
                      <div className="text-[10px] text-muted-foreground mono truncate">{cluster.host}</div>
                    </div>
                  </div>
                </td>
                <td className="mono text-xs text-muted-foreground text-center">{cluster.version}</td>
                <td className="text-center text-sm font-medium">{cluster.workerNodes}</td>
                <td className="text-center text-sm">{cluster.namespaces}</td>
                <td className="text-center text-sm">{cluster.services}</td>
                <td className="text-center text-sm">{cluster.deployments}</td>
                <td className="text-center text-sm font-medium">{cluster.hpaCount}</td>
                <td className="text-center">
                  <span className="mono text-xs">
                    {cluster.runningPods}
                    <span className="text-muted-foreground">/{cluster.maxPods}</span>
                  </span>
                </td>
                <td className="text-center">
                  <span className={`text-xs ${cluster.utilPercent > 80 ? 'text-critical font-bold' : cluster.utilPercent > 50 ? 'text-attention font-medium' : 'text-success'}`}>
                    {cluster.utilPercent}%
                  </span>
                </td>
                <td className="text-center">
                  <span className={`text-xs ${getAllocationColor(cluster.cpuAllocation)}`}>
                    {cluster.cpuAllocation}%
                  </span>
                </td>
                <td className="text-center">
                  <span className={`text-xs ${getAllocationColor(cluster.memAllocation)}`}>
                    {cluster.memAllocation}%
                  </span>
                </td>
                <td className="text-center">
                  <span className={`status-badge text-xs ${statusStyles[cluster.status]}`}>
                    {cluster.status}
                  </span>
                </td>
              </tr>
            ))}
            {/* TOTAL Row */}
            <tr className="bg-muted/50 border-t-2 border-border font-semibold">
              <td className="text-foreground text-sm">TOTAL ({filteredClusters.length} clusters)</td>
              <td className="text-center text-muted-foreground">—</td>
              <td className="text-center text-sm">{totals.workerNodes}</td>
              <td className="text-center text-sm">{totals.namespaces}</td>
              <td className="text-center text-sm">{totals.services}</td>
              <td className="text-center text-sm">{totals.deployments}</td>
              <td className="text-center text-sm">{totals.hpaCount}</td>
              <td className="text-center">
                <span className="mono text-xs">
                  {totals.runningPods}
                  <span className="text-muted-foreground">/{totals.maxPods}</span>
                </span>
              </td>
              <td className="text-center">
                <span className={`text-xs ${avgUtilPercent > 80 ? 'text-critical' : avgUtilPercent > 50 ? 'text-attention' : 'text-success'}`}>
                  {avgUtilPercent}%
                </span>
              </td>
              <td className="text-center">
                <span className={`text-xs ${getAllocationColor(avgCpuAllocation)}`}>
                  {avgCpuAllocation}%
                </span>
              </td>
              <td className="text-center">
                <span className={`text-xs ${getAllocationColor(avgMemAllocation)}`}>
                  {avgMemAllocation}%
                </span>
              </td>
              <td className="text-center text-muted-foreground">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
