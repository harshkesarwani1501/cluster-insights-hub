import { ClusterData } from '@/types/cluster';
import { Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ClusterTableProps {
  clusters: ClusterData[];
}

const statusStyles: Record<ClusterData['status'], string> = {
  Healthy: 'status-healthy',
  Attention: 'status-attention',
  Warning: 'status-warning',
  Critical: 'status-critical',
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
      'Cluster',
      'Host',
      'Version',
      'Workers',
      'Cordoned',
      'Namespaces',
      'Services',
      'Deployments',
      'Running Pods',
      'Max Pods',
      'Utilization %',
      'Status',
    ];
    const rows = filteredClusters.map((c) => [
      c.cluster,
      c.host,
      c.version,
      c.workerNodes,
      c.cordonedNodes,
      c.namespaces,
      c.services,
      c.deployments,
      c.runningPods,
      c.maxPods,
      c.utilPercent,
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
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clusters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="dashboard" onClick={exportCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Cluster</TableHead>
              <TableHead className="font-semibold">Version</TableHead>
              <TableHead className="font-semibold text-center">Workers</TableHead>
              <TableHead className="font-semibold text-center">Namespaces</TableHead>
              <TableHead className="font-semibold text-center">Services</TableHead>
              <TableHead className="font-semibold text-center">Deployments</TableHead>
              <TableHead className="font-semibold text-center">Pods</TableHead>
              <TableHead className="font-semibold text-center">Utilization</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClusters.map((cluster) => (
              <TableRow key={cluster.cluster} className="hover:bg-muted/20">
                <TableCell>
                  <div>
                    <div className="font-medium">{cluster.cluster}</div>
                    <div className="text-xs text-muted-foreground mono">{cluster.host}</div>
                  </div>
                </TableCell>
                <TableCell className="mono text-sm">v{cluster.version}</TableCell>
                <TableCell className="text-center">{cluster.workerNodes}</TableCell>
                <TableCell className="text-center">{cluster.namespaces}</TableCell>
                <TableCell className="text-center">{cluster.services}</TableCell>
                <TableCell className="text-center">{cluster.deployments}</TableCell>
                <TableCell className="text-center">
                  {cluster.runningPods}/{cluster.maxPods}
                </TableCell>
                <TableCell className="text-center">
                  <span className={cluster.utilPercent > 80 ? 'text-critical font-semibold' : ''}>
                    {cluster.utilPercent}%
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`status-badge ${statusStyles[cluster.status]}`}>
                    {cluster.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
