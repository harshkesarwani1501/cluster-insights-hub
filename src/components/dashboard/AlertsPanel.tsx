import { mockAlerts } from '@/data/mockData';
import { Cpu, HardDrive, AlertTriangle, Server, Cloud } from 'lucide-react';

export const AlertsPanel = () => {
  const alerts = mockAlerts;

  if (alerts.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
          <AlertTriangle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">All Systems Healthy</h3>
        <p className="text-muted-foreground">No high resource usage detected across all clusters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {alerts.map((alert) => (
        <div key={alert.cluster} className="glass-card p-5 border-l-4 border-critical">
          <div className="flex items-center gap-3 mb-4">
            {alert.platform === 'AKS' ? (
              <Cloud className="w-5 h-5 text-primary" />
            ) : (
              <Server className="w-5 h-5 text-primary" />
            )}
            <div>
              <h3 className="font-semibold text-foreground">{alert.cluster}</h3>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {alert.platform}
              </span>
            </div>
          </div>

          {alert.cpu.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Cpu className="w-3 h-3" />
                <span className="uppercase tracking-wide font-medium">CPU Alerts</span>
              </div>
              <div className="space-y-1">
                {alert.cpu.map((item) => (
                  <div
                    key={item.node}
                    className="flex items-center justify-between text-sm bg-critical/10 rounded-lg px-3 py-2"
                  >
                    <span className="mono text-foreground text-xs">{item.node}</span>
                    <span className={`font-bold ${item.usage >= 90 ? 'text-critical' : 'text-warning'}`}>
                      {item.usage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alert.memory.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <HardDrive className="w-3 h-3" />
                <span className="uppercase tracking-wide font-medium">Memory Alerts</span>
              </div>
              <div className="space-y-1">
                {alert.memory.map((item) => (
                  <div
                    key={item.node}
                    className="flex items-center justify-between text-sm bg-critical/10 rounded-lg px-3 py-2"
                  >
                    <span className="mono text-foreground text-xs">{item.node}</span>
                    <span className={`font-bold ${item.usage >= 90 ? 'text-critical' : 'text-warning'}`}>
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
  );
};
