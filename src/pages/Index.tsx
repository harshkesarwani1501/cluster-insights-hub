import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FilterTabs } from '@/components/dashboard/FilterTabs';
import { ClusterTable } from '@/components/dashboard/ClusterTable';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { PlatformSelector } from '@/components/dashboard/PlatformSelector';
import { DateSelector } from '@/components/dashboard/DateSelector';
import { mockClusters } from '@/data/mockData';
import { FilterOption, ClusterData, PlatformType } from '@/types/cluster';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [activePlatform, setActivePlatform] = useState<PlatformType>('K8s');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [clusters] = useState<ClusterData[]>(mockClusters);

  // Filter by platform first
  const platformClusters = clusters.filter((c) => c.platform === activePlatform);

  // Then filter by environment
  const filteredClusters = platformClusters.filter((c) => {
    if (activeFilter === 'All') return true;
    return c.environment === activeFilter;
  });

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Data refreshed successfully', {
      description: `${activePlatform} cluster metrics updated for ${format(selectedDate, 'PPP')}.`,
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    toast.info(`Viewing ${isToday ? 'current' : 'historical'} data`, {
      description: `Showing data from ${format(date, 'PPP')}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={handleRefresh} activePlatform={activePlatform} />
      
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Platform Selector & Date Picker */}
        <div className="flex items-center justify-between mb-6">
          <PlatformSelector 
            activePlatform={activePlatform} 
            onPlatformChange={setActivePlatform} 
          />
          <DateSelector 
            selectedDate={selectedDate} 
            onDateChange={handleDateChange} 
          />
        </div>

        {/* Stats Bar */}
        <StatsBar clusters={platformClusters} />
        
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-4">
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredClusters.length}</span> of {platformClusters.length} clusters
          </p>
        </div>

        {/* Table View */}
        <ClusterTable clusters={filteredClusters} />
      </main>
    </div>
  );
};

export default Index;
