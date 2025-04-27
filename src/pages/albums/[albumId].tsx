import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { getAlbumInfo } from '@/handlers/api/album.handler'
import { IAlbum } from '@/types/album'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AlbumPeople from '@/components/albums/info/AlbumPeople'
import AlbumImages from '@/components/albums/info/AlbumImages'
import { Camera, ExternalLink, Users } from 'lucide-react'
import { humanizeNumber } from '@/helpers/string.helper'

export default function AlbumListPage() {
  const { exImmichUrl } = useConfig()
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
      <div className="flex divide-y">
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
              <p className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
                {humanizeNumber(albumInfo?.assetCount || 0)}
                {' '}
                <Camera className="w-4 h-4" />
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
                {humanizeNumber(albumInfo?.faceCount || 0)}
                {' '}
                <Users className="w-4 h-4" />
              </p>
              <Link
                className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-500"
                target="_blank"
                href={`${exImmichUrl}/albums/${albumId}`}>
                <ExternalLink className="w-4 h-4" />
                Open In Immich
              </Link> 
            </div>
          )
        }
      />
      {renderContent()}
    </PageLayout>
  )
}
