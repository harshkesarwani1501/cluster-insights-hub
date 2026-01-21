import { RefreshCw, Cloud, MoreVertical, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onRefresh: () => void;
}

export const Header = ({ onRefresh }: HeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

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
      <div className="flex items-center gap-3">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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