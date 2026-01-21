import { useState } from 'react';
import { Header } from '@/components/dashboard/Header';
import { FilterTabs } from '@/components/dashboard/FilterTabs';
import { ClusterCard } from '@/components/dashboard/ClusterCard';
import { ClusterTable } from '@/components/dashboard/ClusterTable';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { mockClusters } from '@/data/mockData';
import { FilterOption, ClusterData } from '@/types/cluster';
import { toast } from 'sonner';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [clusters] = useState<ClusterData[]>(mockClusters);

  const filteredClusters = clusters.filter((c) => {
    if (activeFilter === 'All' || activeFilter === 'Table') return true;
    if (activeFilter === 'Dev') return c.cluster.toLowerCase().includes('dev');
    if (activeFilter === 'QAS') return c.cluster.toLowerCase().includes('qas');
    return true;
  });

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Data refreshed successfully', {
      description: 'All cluster metrics have been updated.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={handleRefresh} />
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        <StatsBar clusters={clusters} />
        
        <div className="flex items-center justify-between mb-6">
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredClusters.length}</span> cluster{filteredClusters.length !== 1 ? 's' : ''}
          </p>
        </div>

        {activeFilter === 'Table' ? (
          <ClusterTable clusters={filteredClusters} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClusters.map((cluster) => (
              <ClusterCard key={cluster.cluster} cluster={cluster} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
