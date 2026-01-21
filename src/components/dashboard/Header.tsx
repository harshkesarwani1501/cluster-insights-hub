import { RefreshCw, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface HeaderProps {
  onRefresh: () => void;
}

export const Header = ({ onRefresh }: HeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="flex items-center justify-between py-6 px-8 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 glow-primary">
          <Cloud className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Kubernetes <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time cluster monitoring & management
          </p>
        </div>
      </div>
      <Button
        variant="dashboard"
        size="lg"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </header>
  );
};
