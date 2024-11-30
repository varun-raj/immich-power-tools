import { ASSET_THUMBNAIL_PATH } from '@/config/routes'
import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { getAlbumInfo, listAlbums } from '@/handlers/api/album.handler'
import { IAlbum } from '@/types/album'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import AlbumThumbnail from '@/components/albums/list/AlbumThumbnail'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import AlbumPeople from '@/components/albums/info/AlbumPeople'
import AlbumImages from '@/components/albums/info/AlbumImages'

export default function AlbumListPage() {
  const router = useRouter()
  const { pathname } = router
  const { albumId, faceId } = router.query as { albumId: string, faceId: string }
  const [albumInfo, setAlbumInfo] = useState<IAlbum>()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedAlbums, setSelectedAlbums] = useState<string[]>([])

  const fetchAlbumInfo = async () => {
    setLoading(true)
    getAlbumInfo(albumId)
      .then(setAlbumInfo)
      .catch((error) => {
        setErrorMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchAlbumInfo()
  }, [])

  const handleSelect = (checked: boolean, albumId: string) => {
    if (checked) {
      setSelectedAlbums([...selectedAlbums, albumId])
    } else {
      setSelectedAlbums(selectedAlbums.filter((id) => id !== albumId))
    }
  }

  const handleSelectPerson = (personId: string) => {
    if (faceId === personId) {
      router.push({
        pathname,
        query: {
          albumId
        }
      })
    } else {
      router.push({
        pathname,
        query: {
          albumId,
          faceId: personId
        }
      })
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
      <div className="flex flex-col gap-4 p-4">
        {albumInfo && (
          <>
            <AlbumPeople album={albumInfo} key={albumInfo.id} onSelect={handleSelectPerson} />
            <AlbumImages album={albumInfo} key={albumInfo.id} />
          </>
        )}
      </div>
    )
  }
  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent={albumInfo?.albumName || "Loading..."}
        rightComponent={
          !loading && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700 dark:text-gray-500">{albumInfo?.assetCount} photos</p>
              <p className="text-sm text-gray-700 dark:text-gray-500">{albumInfo?.faceCount} faces</p>
            </div>
          )
        }
      />
      {renderContent()}
    </PageLayout>
  )
}
