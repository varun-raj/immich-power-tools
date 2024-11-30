import { ASSET_THUMBNAIL_PATH } from '@/config/routes'
import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { listAlbums } from '@/handlers/api/album.handler'
import { IAlbum } from '@/types/album'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import AlbumThumbnail from '@/components/albums/list/AlbumThumbnail'
import { Button } from '@/components/ui/button'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/router'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { SortAsc, SortDesc } from 'lucide-react'

const SORT_BY_OPTIONS = [
  { value: 'lastPhotoDate', label: 'Last Photo Date' },
  { value: 'firstPhotoDate', label: 'First Photo Date' },
  { value: 'assetCount', label: 'Asset Count' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
  { value: 'albumName', label: 'Album Name' },
  { value: 'albumSize', label: 'Album Size' },
  { value: 'faceCount', label: 'Number of People' },
]
export default function AlbumListPage() {
  const { exImmichUrl } = useConfig()
  const router = useRouter()
  const { query, pathname } = router
  const { sortBy, sortOrder } = query as { sortBy: string, sortOrder: string }
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([])

  const selectedSortBy = useMemo(() => SORT_BY_OPTIONS.find((option) => option.value === sortBy), [sortBy])

  const fetchAlbums = async () => {
    setLoading(true)
    listAlbums({
      sortBy,
      sortOrder
    })
      .then(setAlbums)
      .catch((error) => {
        setErrorMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAlbums()
  }, [sortBy, sortOrder])

  const handleSelect = (checked: boolean, albumId: string) => {
    if (checked) {
      setSelectedAlbums([...selectedAlbums, albumId])
    } else {
      setSelectedAlbums(selectedAlbums.filter((id) => id !== albumId))
    }
  }


  const renderContent = () => {

    if (loading) {
      return <Loader />
    }
    else if (errorMessage) {
      return <div>{errorMessage}</div>
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {albums.map((album) => (
          <AlbumThumbnail album={album} key={album.id} onSelect={(checked) => handleSelect(checked, album.id)} />
        ))}
      </div>
    )
  }
  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent="Albums"
        rightComponent={
          <div className="flex items-center gap-2">
            <Select
              defaultValue={selectedSortBy?.value}
              onValueChange={(value) => router.push({
                pathname,
              query: {
                ...query,
                sortBy: value,
              }
              
            })}>
              <SelectTrigger className="px-2">
                <SelectValue placeholder="Sort by">{selectedSortBy?.label || 'Sort by'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_BY_OPTIONS.map((option) => (
                  <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="px-2" variant={"secondary"} onClick={() => router.push({
              pathname,
              query: {
                ...query,
                sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
              }
            })}>
              {sortOrder === 'asc' ? <SortAsc /> : <SortDesc />}
            </Button>
          </div>
        }
      />
      {renderContent()}
    </PageLayout>
  )
}
