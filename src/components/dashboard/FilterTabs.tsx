import { FilterOption } from '@/types/cluster';
import { LayoutGrid, Code2, TestTube2, Table2 } from 'lucide-react';

interface FilterTabsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { label: FilterOption; icon: React.ReactNode }[] = [
  { label: 'All', icon: <LayoutGrid className="w-4 h-4" /> },
  { label: 'Dev', icon: <Code2 className="w-4 h-4" /> },
  { label: 'QAS', icon: <TestTube2 className="w-4 h-4" /> },
  { label: 'Table', icon: <Table2 className="w-4 h-4" /> },
];

export const FilterTabs = ({ activeFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl w-fit">
      {filters.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onFilterChange(label)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${
              activeFilter === label
                ? 'bg-primary text-primary-foreground shadow-lg glow-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
