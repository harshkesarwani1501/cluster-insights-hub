import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { mockAlerts } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Alerts = () => {
  const navigate = useNavigate();

  const handleAlertRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('Alerts refreshed', {
      description: 'Resource usage data updated.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 py-6 px-8 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            High Resource <span className="text-gradient">Alerts</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Nodes with ≥80% resource usage
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <AlertsPanel alerts={mockAlerts} onRefresh={handleAlertRefresh} />
      </main>
    </div>
  );
};

export default Alerts;
