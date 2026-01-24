import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { useState } from 'react';

const Alerts = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Alerts refreshed', {
      description: 'Resource usage data updated.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between py-4 px-6 border-b border-border bg-card/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              High Resource <span className="text-gradient">Alerts</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Nodes with CPU or Memory usage ≥ 80%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <AlertsPanel />
      </main>
    </div>
  );
};

export default Alerts;
