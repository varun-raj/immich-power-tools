import { ASSET_THUMBNAIL_PATH } from '@/config/routes'
import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { listAlbums } from '@/handlers/api/album.handler'
import { IAlbum } from '@/types/album'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import AlbumThumbnail from '@/components/albums/list/AlbumThumbnail'
import { Button } from '@/components/ui/button'

export default function AlbumListPage() {
  const { exImmichUrl } = useConfig()
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([])

  const fetchAlbums = async () => {
    setLoading(true)
    listAlbums()
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
  }, [])

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
      />
      {renderContent()}
    </PageLayout>
  )
}
