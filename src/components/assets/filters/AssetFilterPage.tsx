import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import React from 'react'
import { AssetFilterProvider } from '@/contexts/AssetFilterContext'
import { AssetFilterDropdown } from './AssetFilterDropdown'
import { AssetFilterList } from './AssetFilterList'
import FilteredAssets from './FilteredAssets'

export default function AssetFilterPage() {
  return (
    <AssetFilterProvider>
      <PageLayout>
        <Header leftComponent="Asset Filters" />
        <div className="flex flex-col gap-4">
          <AssetFilterDropdown />
          <AssetFilterList />
        </div>
        <FilteredAssets />
      </PageLayout>
    </AssetFilterProvider>
  )
}