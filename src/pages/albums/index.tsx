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

export default function AlbumListPage() {
const { exImmichUrl } = useConfig()
  const [albums, setAlbums] = useState<IAlbum[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
          <div key={album.id} className="border rounded-lg overflow-hidden shadow-lg">
            <Image
              src={ASSET_THUMBNAIL_PATH(album.albumThumbnailAssetId)} // Assuming this is a URL to the thumbnail
              alt={album.albumName}
              width={300}
              height={300}
              loading='lazy'
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <Link href={`${exImmichUrl}/albums/${album.id}`} target="_blank">  
                <h2 className="text-md font-semibold truncate">{album.albumName}</h2>
              </Link>
              <p className="text-sm text-gray-700 dark:text-gray-500">{album.assetCount} assets</p>
            </div>
          </div>
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
