import { FilterOption } from '@/types/cluster';
import { LayoutGrid, Code2, TestTube2, Rocket } from 'lucide-react';

interface FilterTabsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { label: FilterOption; icon: React.ReactNode }[] = [
  { label: 'All', icon: <LayoutGrid className="w-4 h-4" /> },
  { label: 'Dev', icon: <Code2 className="w-4 h-4" /> },
  { label: 'QAS', icon: <TestTube2 className="w-4 h-4" /> },
  { label: 'Prod', icon: <Rocket className="w-4 h-4" /> },
];

export const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {filters.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onFilterChange(label)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              activeFilter === label
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }
          `}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};
