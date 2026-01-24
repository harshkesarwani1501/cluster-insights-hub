import { PlatformType } from '@/types/cluster';
import { Cloud, Server } from 'lucide-react';

interface PlatformSelectorProps {
  activePlatform: PlatformType;
  onPlatformChange: (platform: PlatformType) => void;
}

const platforms: { label: PlatformType; icon: React.ReactNode; description: string }[] = [
  { 
    label: 'K8s', 
    icon: <Server className="w-5 h-5" />, 
    description: 'Kubernetes' 
  },
  { 
    label: 'AKS', 
    icon: <Cloud className="w-5 h-5" />, 
    description: 'Azure Kubernetes' 
  },
];

export const PlatformSelector = ({ activePlatform, onPlatformChange }: PlatformSelectorProps) => {
  return (
    <div className="flex gap-3">
      {platforms.map(({ label, icon, description }) => (
        <button
          key={label}
          onClick={() => onPlatformChange(label)}
          className={`
            relative flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold
            transition-all duration-300 border-2
            ${
              activePlatform === label
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            }
          `}
        >
          <span className={activePlatform === label ? 'text-primary-foreground' : 'text-muted-foreground'}>
            {icon}
          </span>
          <div className="text-left">
            <div className="font-bold">{label}</div>
            <div className={`text-xs ${activePlatform === label ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {description}
            </div>
          </div>
          {activePlatform === label && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
          )}
        </button>
      ))}
    </div>
  );
};
