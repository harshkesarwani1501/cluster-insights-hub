import { ClusterData } from '@/types/cluster';
import { Download, Search, AlertTriangle, Cpu, HardDrive } from 'lucide-react';
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

const getUtilColor = (value: number) => {
  if (value >= 100) return 'text-critical font-bold';
  if (value >= 80) return 'text-warning font-semibold';
  if (value >= 60) return 'text-attention';
  return 'text-success';
};

// Format memory for display (e.g., "224649Mi" -> "219Gi")
const formatMemory = (mem: string): string => {
  const match = mem.match(/^(\d+)(Mi|Gi|Ki)?$/);
  if (!match) return mem;
  
  const value = parseInt(match[1], 10);
  const unit = match[2] || 'Mi';
  
  if (unit === 'Mi' && value >= 1024) {
    return `${Math.round(value / 1024)}Gi`;
  }
  if (unit === 'Ki' && value >= 1024 * 1024) {
    return `${Math.round(value / (1024 * 1024))}Gi`;
  }
  return mem;
};

export const ClusterTable = ({ clusters }: ClusterTableProps) => {
  const [search, setSearch] = useState('');

  const filteredClusters = clusters.filter(
    (c) =>
      c.cluster.toLowerCase().includes(search.toLowerCase()) ||
      c.environment.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = [
      'Platform',
      'Cluster',
      'Environment',
      'Version',
      'Workers',
      'Cordoned Nodes',
      'Namespaces',
      'Services',
      'Deployments',
      'HPA',
      'Used Pods',
      'Pod Capacity',
      'Utilization %',
      'CPU Allocated',
      'Memory Allocated',
      'Status',
      'High Usage CPU Nodes',
      'High Usage Memory Nodes',
    ];
    const rows = filteredClusters.map((c) => [
      c.platform,
      c.cluster,
      c.environment,
      c.version,
      c.workerNodes,
      c.cordonedNodes.length > 0 ? c.cordonedNodes.join('; ') : 'None',
      c.namespaces,
      c.services,
      c.deployments,
      c.hpaCount,
      c.usedPods,
      c.podCapacity,
      c.utilPercent,
      c.cpuAllocated,
      c.memAllocated,
      c.status,
      c.highUsageNodes.cpu.map(n => `${n.node}:${n.usage}%`).join('; ') || 'None',
      c.highUsageNodes.memory.map(n => `${n.node}:${n.usage}%`).join('; ') || 'None',
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
      namespaces: acc.namespaces + c.namespaces,
      services: acc.services + c.services,
      deployments: acc.deployments + c.deployments,
      hpaCount: acc.hpaCount + c.hpaCount,
      usedPods: acc.usedPods + c.usedPods,
      podCapacity: acc.podCapacity + c.podCapacity,
      cpuAllocated: acc.cpuAllocated + c.cpuAllocated,
    }),
    {
      workerNodes: 0,
      namespaces: 0,
      services: 0,
      deployments: 0,
      hpaCount: 0,
      usedPods: 0,
      podCapacity: 0,
      cpuAllocated: 0,
    }
  );

  const avgUtilPercent = totals.podCapacity > 0 ? Math.round((totals.usedPods / totals.podCapacity) * 100) : 0;

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
      <div className="w-full overflow-x-auto">
        <table className="data-table w-full table-fixed min-w-[1200px]">
          <thead>
            <tr>
              <th className="w-[11%]">Cluster</th>
              <th className="w-[4%] text-center">Env</th>
              <th className="w-[6%] text-center">Ver</th>
              <th className="w-[3%] text-center">Wrk</th>
              <th className="w-[3%] text-center">NS</th>
              <th className="w-[3%] text-center">Svc</th>
              <th className="w-[3%] text-center">Dply</th>
              <th className="w-[3%] text-center">HPA</th>
              <th className="w-[7%] text-center">Pods</th>
              <th className="w-[4%] text-center">Util</th>
              <th className="w-[4%] text-center">CPU</th>
              <th className="w-[5%] text-center">Mem</th>
              <th className="w-[12%]">Cordon Nodes</th>
              <th className="w-[18%]">Alerts</th>
              <th className="w-[6%] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClusters.map((cluster) => {
              const hasAlerts = cluster.highUsageNodes.cpu.length > 0 || cluster.highUsageNodes.memory.length > 0;
              const hasCordoned = cluster.cordonedNodes.length > 0;
              
              return (
                <tr key={cluster.cluster}>
                  <td className="truncate">
                    <span className="font-medium text-foreground text-sm truncate">{cluster.cluster}</span>
                  </td>
                  <td className="text-center text-xs font-medium">
                    <span className={`px-1.5 py-0.5 rounded ${
                      cluster.environment === 'Prod' ? 'bg-critical/20 text-critical' :
                      cluster.environment === 'QAS' ? 'bg-attention/20 text-attention' :
                      'bg-success/20 text-success'
                    }`}>
                      {cluster.environment}
                    </span>
                  </td>
                  <td className="mono text-xs text-muted-foreground text-center">{cluster.version}</td>
                  <td className="text-center text-sm font-medium">{cluster.workerNodes}</td>
                  <td className="text-center text-sm">{cluster.namespaces}</td>
                  <td className="text-center text-sm">{cluster.services}</td>
                  <td className="text-center text-sm">{cluster.deployments}</td>
                  <td className="text-center text-sm font-medium">{cluster.hpaCount}</td>
                  <td className="text-center">
                    <span className="mono text-xs">
                      {cluster.usedPods}
                      <span className="text-muted-foreground">/{cluster.podCapacity}</span>
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`text-xs ${getUtilColor(cluster.utilPercent)}`}>
                      {cluster.utilPercent}%
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="text-xs font-medium text-foreground">{cluster.cpuAllocated}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-xs font-medium text-foreground">{formatMemory(cluster.memAllocated)}</span>
                  </td>
                  {/* Cordon Nodes Column */}
                  <td className="text-xs">
                    {hasCordoned ? (
                      <div className="flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0 mt-0.5" />
                        <span className="mono text-warning truncate" title={cluster.cordonedNodes.join(', ')}>
                          {cluster.cordonedNodes.length <= 2 
                            ? cluster.cordonedNodes.join(', ')
                            : `${cluster.cordonedNodes.slice(0, 2).join(', ')} +${cluster.cordonedNodes.length - 2}`
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  {/* Alerts Column - Show details inline */}
                  <td className="text-xs">
                    {hasAlerts ? (
                      <div className="space-y-0.5">
                        {cluster.highUsageNodes.cpu.map(n => (
                          <div key={`cpu-${n.node}`} className="flex items-center gap-1 text-critical">
                            <Cpu className="w-3 h-3 flex-shrink-0" />
                            <span className="mono truncate" title={n.node}>{n.node}: {n.usage}%</span>
                          </div>
                        ))}
                        {cluster.highUsageNodes.memory.map(n => (
                          <div key={`mem-${n.node}`} className="flex items-center gap-1 text-warning">
                            <HardDrive className="w-3 h-3 flex-shrink-0" />
                            <span className="mono truncate" title={n.node}>{n.node}: {n.usage}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-success">—</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span className={`status-badge text-xs ${statusStyles[cluster.status]}`}>
                      {cluster.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {/* TOTAL Row */}
            <tr className="bg-muted/50 border-t-2 border-border font-semibold">
              <td className="text-foreground text-sm">TOTAL ({filteredClusters.length})</td>
              <td className="text-center text-muted-foreground">—</td>
              <td className="text-center text-muted-foreground">—</td>
              <td className="text-center text-sm">{totals.workerNodes}</td>
              <td className="text-center text-sm">{totals.namespaces}</td>
              <td className="text-center text-sm">{totals.services}</td>
              <td className="text-center text-sm">{totals.deployments}</td>
              <td className="text-center text-sm">{totals.hpaCount}</td>
              <td className="text-center">
                <span className="mono text-xs">
                  {totals.usedPods}
                  <span className="text-muted-foreground">/{totals.podCapacity}</span>
                </span>
              </td>
              <td className="text-center">
                <span className={`text-xs ${getUtilColor(avgUtilPercent)}`}>
                  {avgUtilPercent}%
                </span>
              </td>
              <td className="text-center text-sm">{totals.cpuAllocated}</td>
              <td className="text-center text-muted-foreground">—</td>
              <td className="text-muted-foreground">—</td>
              <td className="text-muted-foreground">—</td>
              <td className="text-center text-muted-foreground">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
