import { RefreshCw, MoreVertical, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PlatformType } from '@/types/cluster';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onRefresh: () => void;
  activePlatform: PlatformType;
}

export const Header = ({ onRefresh, activePlatform }: HeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const platformLabel = activePlatform === 'K8s' ? 'Kubernetes' : 'Azure Kubernetes Service';
  const platformShort = activePlatform === 'K8s' ? 'K8s' : 'AKS';

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border bg-card/50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <span className="text-2xl font-bold text-primary">{platformShort}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {platformLabel} <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time cluster monitoring & management
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/alerts')}
          className="gap-2 border-critical/50 text-critical hover:bg-critical/10"
        >
          <AlertTriangle className="w-4 h-4" />
          Alerts
        </Button>
        
        <ThemeToggle />
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover">
            <DropdownMenuItem onClick={() => navigate('/alerts')} className="cursor-pointer">
              <AlertTriangle className="w-4 h-4 mr-2 text-critical" />
              High Resource Alerts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
