import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { listEmptyVideos, deleteAssets } from '@/handlers/api/asset.handler'
import { IAsset } from '@/types/asset'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { Camera, Trash2 } from 'lucide-react'
import { humanizeNumber } from '@/helpers/string.helper'
import PhotoSelectionContext, { IPhotoSelectionContext } from '@/contexts/PhotoSelectionContext'
import FloatingBar from '@/components/shared/FloatingBar'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import AssetGrid from '@/components/shared/AssetGrid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function EmptyVideosPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<IAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  
  // Initialize filters from URL params or defaults
  const getInitialFilters = () => {
    const { maxDuration, sortBy, sortOrder, page, limit } = router.query
    return {
      limit: typeof limit === 'string' ? parseInt(limit, 10) : 100,
      page: typeof page === 'string' ? parseInt(page, 10) : 1,
      maxDuration: typeof maxDuration === 'string' ? parseFloat(maxDuration) : 2,
      sortBy: typeof sortBy === 'string' ? sortBy : 'localDateTime',
      sortOrder: typeof sortOrder === 'string' ? sortOrder : 'desc'
    }
  }
  
  const [filters, setFilters] = useState(getInitialFilters)

  // Update URL with current filters
  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams()
    if (newFilters.maxDuration > 0) params.set('maxDuration', newFilters.maxDuration.toString())
    if (newFilters.sortBy !== 'localDateTime') params.set('sortBy', newFilters.sortBy)
    if (newFilters.sortOrder !== 'desc') params.set('sortOrder', newFilters.sortOrder)
    if (newFilters.page > 1) params.set('page', newFilters.page.toString())
    if (newFilters.limit !== 100) params.set('limit', newFilters.limit.toString())
    
    const newURL = params.toString() ? `?${params.toString()}` : ''
    router.push(`${router.pathname}${newURL}`, undefined, { shallow: true })
  }

  // PhotoSelection context state
  const [contextState, setContextState] = useState<IPhotoSelectionContext>({
    selectedIds: [],
    assets: [],
    config: {
      albumId: '',
      sort: "fileOriginalDate",
      sortOrder: "asc"
    },
    updateContext: (newConfig: Partial<IPhotoSelectionContext>) => {
      setContextState(prevState => ({
        ...prevState,
        ...newConfig,
        config: newConfig.config ? { ...prevState.config, ...newConfig.config } : prevState.config
      }));
    }
  });

  const selectedAssets = useMemo(() => 
    contextState.assets.filter((a) => contextState.selectedIds.includes(a.id)), 
    [contextState.assets, contextState.selectedIds]
  );

  const fetchEmptyVideos = async () => {
    setLoading(true)
    listEmptyVideos(filters)
      .then((fetchedAssets) => {
        setAssets(fetchedAssets)
        contextState.updateContext({
          assets: fetchedAssets
        })
      })
      .catch((error) => {
        setErrorMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEmptyVideos()
  }, [filters])

  const handleSelectionChange = (selectedIds: string[]) => {
    contextState.updateContext({
      selectedIds: selectedIds
    })
  }

  const handleDelete = () => {
    return deleteAssets(contextState.selectedIds).then(() => {
      const newAssets = contextState.assets.filter((a) => !contextState.selectedIds.includes(a.id));
      setAssets(newAssets)
      contextState.updateContext({
        selectedIds: [],
        assets: newAssets,
      });
    })
  }

  const [durationInputValue, setDurationInputValue] = useState(filters.maxDuration === 0 ? '' : filters.maxDuration.toString())

  // Update filters when URL changes
  useEffect(() => {
    if (router.isReady) {
      const newFilters = getInitialFilters()
      setFilters(newFilters)
      setDurationInputValue(newFilters.maxDuration === 0 ? '' : newFilters.maxDuration.toString())
    }
  }, [router.isReady, router.query])

  const handleMaxDurationChange = (value: string) => {
    setDurationInputValue(value)
  }

  const handleMaxDurationBlur = () => {
    if (durationInputValue === '') {
      const newFilters = { ...filters, maxDuration: 0, page: 1 }
      setFilters(newFilters)
      updateURL(newFilters)
      return
    }
    
    const numValue = parseFloat(durationInputValue)
    if (isNaN(numValue) || numValue < 0.1) {
      // Reset to previous valid value
      setDurationInputValue(filters.maxDuration === 0 ? '' : filters.maxDuration.toString())
      return
    }
    
    const newFilters = { ...filters, maxDuration: numValue, page: 1 }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy, page: 1 }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleSortOrderChange = (sortOrder: string) => {
    const newFilters = { ...filters, sortOrder, page: 1 }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const renderContent = () => {
    if (loading) {
      return <Loader />
    }
    else if (errorMessage) {
      return <div className="text-red-500 p-4">{errorMessage}</div>
    }
    return (
      <div className="p-4">
        {assets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No empty videos found with the current filters.
          </div>
        ) : (
          <AssetGrid 
            assets={assets} 
            selectable={true}
            onSelectionChange={handleSelectionChange}
          />
        )}
      </div>
    )
  }

  return (
    <PageLayout className="!p-0 !mb-0 relative">
      <Header
        leftComponent="Empty Videos"
        rightComponent={
          !loading && (
            <div className="flex items-center gap-4">
              {/* Duration Filter */}
              <div className="flex items-center gap-2">
                <Label htmlFor="maxDuration" className="text-sm font-medium whitespace-nowrap">
                  Max Duration:
                </Label>
                                  <Input
                    id="maxDuration"
                    type="number"
                    min="0.1"
                    max="60"
                    step="0.1"
                    value={durationInputValue}
                    onChange={(e) => handleMaxDurationChange(e.target.value)}
                    onBlur={handleMaxDurationBlur}
                    className="w-20 h-8"
                  />
                <span className="text-sm text-gray-500">s</span>
              </div>



              {/* Asset Count */}
              <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
                {humanizeNumber(assets.length)}
                {' '}
                <Camera className="w-4 h-4" />
              </div>
            </div>
          )
        }
      />
      <PhotoSelectionContext.Provider
        value={{
          ...contextState,
          updateContext: contextState.updateContext,
        }}
      >
        {renderContent()}
        {selectedAssets.length > 0 &&
          <FloatingBar>
            <div className="flex items-center gap-2 justify-between w-full">
              <p className="text-sm text-muted-foreground">
                {contextState.selectedIds.length} Selected
              </p>
              <div className="flex items-center gap-2">
                {contextState.selectedIds.length === contextState.assets.length ? (
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                      contextState.updateContext({
                        selectedIds: [],
                      })
                    }
                  >
                    Unselect all
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                      contextState.updateContext({
                        selectedIds: contextState.assets.map((a) => a.id),
                      })
                    }
                  >
                    Select all
                  </Button>
                )}
                <div className="h-[10px] w-[1px] bg-zinc-500 dark:bg-zinc-600"></div>
                <AlertDialog
                  title="Delete the selected videos?"
                  description="This action will delete the selected videos and cannot be undone."
                  onConfirm={handleDelete}
                  disabled={contextState.selectedIds.length === 0}
                >
                  <Button variant={"destructive"} size={"sm"} disabled={contextState.selectedIds.length === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialog>
              </div>
            </div>
          </FloatingBar>
        }
      </PhotoSelectionContext.Provider>
    </PageLayout>
  )
}
