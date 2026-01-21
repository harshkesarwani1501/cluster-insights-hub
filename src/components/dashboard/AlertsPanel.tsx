import { ResourceAlert } from '@/types/cluster';
import { AlertTriangle, Cpu, MemoryStick, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AlertsPanelProps {
  alerts: ResourceAlert[];
  onRefresh: () => void;
}

export const AlertsPanel = ({ alerts, onRefresh }: AlertsPanelProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Alerts
        </Button>
      </div>

      {alerts.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-lg font-semibold text-success mb-2">All Systems Healthy</h3>
          <p className="text-muted-foreground">No high resource usage detected across clusters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.cluster}
              className="glass-card p-5 border-l-4 border-l-critical"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-critical" />
                {alert.cluster}
              </h3>

              {alert.cpu.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Cpu className="w-4 h-4" />
                    CPU Alerts
                  </div>
                  <div className="space-y-2">
                    {alert.cpu.map((item) => (
                      <div
                        key={item.node}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                      >
                        <span className="text-sm mono">{item.node}</span>
                        <span
                          className={`text-sm font-semibold ${
                            item.usage >= 90 ? 'text-critical' : 'text-warning'
                          }`}
                        >
                          {item.usage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {alert.memory.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MemoryStick className="w-4 h-4" />
                    Memory Alerts
                  </div>
                  <div className="space-y-2">
                    {alert.memory.map((item) => (
                      <div
                        key={item.node}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                      >
                        <span className="text-sm mono">{item.node}</span>
                        <span
                          className={`text-sm font-semibold ${
                            item.usage >= 90 ? 'text-critical' : 'text-warning'
                          }`}
                        >
                          {item.usage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
