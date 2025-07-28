    import AssetGrid from '@/components/shared/AssetGrid';
import { useAssetFilters } from '@/contexts/AssetFilterContext';
import { filterAssets } from '@/handlers/api/asset.handler';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react'

export default function FilteredAssets() {
    const { filters } = useAssetFilters();

    const { data, isLoading, error } = useInfiniteQuery({
        queryKey: ['filtered-assets', filters],
        queryFn: ({ pageParam = 1 }) => filterAssets({ filters, page: pageParam }),
        getNextPageParam: (lastPage, pages) => lastPage.pagination.page + 1,
        initialPageParam: 1,
    });

  return (
    <div>
       <AssetGrid assets={data?.pages.flatMap((page) => page.assets) || []} />
    </div>
  )
}