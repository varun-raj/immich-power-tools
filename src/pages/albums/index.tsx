import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { deleteAlbums, listAlbums } from '@/handlers/api/album.handler'
import { IAlbum } from '@/types/album'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import AlbumThumbnail from '@/components/albums/list/AlbumThumbnail'
import { Button } from '@/components/ui/button'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/router'
import { Share, SortAsc, SortDesc, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AlbumShareDialog, { IAlbumShareDialogRef } from '@/components/albums/share/AlbumShareDialog'
import { AlertDialog } from '@/components/ui/alert-dialog'
import toast from 'react-hot-toast'

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
  const router = useRouter()
  const [search, setSearch] = useState('')
  const { query, pathname } = router
  const { sortBy, sortOrder } = query as { sortBy: string, sortOrder: string }
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedAlbumsIds, setSelectedAlbumsIds] = useState<string[]>([])
  const albumShareDialogRef = useRef<IAlbumShareDialogRef>(null);
  const [deleting, setDeleting] = useState(false)

  const selectedSortBy = useMemo(() => SORT_BY_OPTIONS.find((option) => option.value === sortBy), [sortBy])

  const searchedAlbums = useMemo(() => albums.filter((album) => album.albumName.toLowerCase().includes(search.toLowerCase())), [albums, search])

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

  const selectedAlbums = useMemo(() => albums.filter((album) => selectedAlbumsIds.includes(album.id)), [albums, selectedAlbumsIds])

  useEffect(() => {
    fetchAlbums()
  }, [sortBy, sortOrder])


  const handleSelect = (checked: boolean, albumId: string) => {
    if (checked) {
      setSelectedAlbumsIds([...selectedAlbumsIds, albumId])
    } else {
      setSelectedAlbumsIds(selectedAlbumsIds.filter((id) => id !== albumId))
    }
  }

  const handleDeleteAlbums = async () => {
    setDeleting(true)
    return deleteAlbums(selectedAlbumsIds).then(() => {
      setSelectedAlbumsIds([])
      setAlbums(albums.filter((album) => !selectedAlbumsIds.includes(album.id)))
      toast.success(`Deleted ${selectedAlbumsIds.length} albums`)
    }).catch((error) => {
      toast.error(error.message)
    }).finally(() => {
      setDeleting(false)
    })
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
        {searchedAlbums.map((album) => (
          <AlbumThumbnail
            album={album}
            key={album.id}
            selected={selectedAlbumsIds.includes(album.id)}
            onSelect={(checked) => handleSelect(checked, album.id)}
          />
        ))}
      </div>
    )
  }
  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent="Manage Albums"
        rightComponent={
          <div className="flex items-center gap-2">
            {!!selectedAlbumsIds.length && (
              <>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  className="flex items-center gap-2"
                  onClick={() => {
                    albumShareDialogRef.current?.open(selectedAlbums)
                  }}>
                  <Share size={16} /> Share {selectedAlbumsIds.length} albums
                </Button>

                <AlertDialog
                  title='Delete Albums'
                  description='Are you sure you want to delete these albums?'
                  onConfirm={handleDeleteAlbums}
                >
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="flex items-center gap-2"
                    disabled={deleting}
                  >
                    <Trash size={16} /> {deleting ? "Deleting..." : `Delete ${selectedAlbumsIds.length} albums`}
                  </Button>
                </AlertDialog>
              </>
            )}
            <Input type="text" placeholder="Search" className="w-48" onChange={(e) => setSearch(e.target.value)} />
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
      <AlbumShareDialog
        ref={albumShareDialogRef}
      />
    </PageLayout>
  )
}
