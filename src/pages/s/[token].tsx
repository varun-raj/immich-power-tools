import PageLayout from '@/components/layouts/PageLayout'
import Header from '@/components/shared/Header'
import Loader from '@/components/ui/loader'
import { useConfig } from '@/contexts/ConfigContext'
import { IAlbum } from '@/types/album'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AlbumPeople from '@/components/albums/info/AlbumPeople'
import AlbumImages from '@/components/albums/info/AlbumImages'
import { Camera, ExternalLink, Users } from 'lucide-react'
import { humanizeNumber } from '@/helpers/string.helper'
import { getShareLinkInfo } from '@/handlers/api/shareLink.handler'
import AssetGrid from '@/components/shared/AssetGrid'
import { IAsset } from '@/types/asset'

export default function AlbumListPage() {
  const router = useRouter()
  const { token } = router.query as { token: string }
  const [assets, setAssets] = useState<IAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchAlbumInfo = async () => {
    setLoading(true)
    getShareLinkInfo(token)
      .then(setAssets)
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

  const renderContent = () => {

    if (loading) {
      return <Loader />
    }
    else if (errorMessage) {
      return <div>{errorMessage}</div>
    }
    return (
      <AssetGrid
        assets={assets}
        isInternal={false}
      />
    )
  }
  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent={"Assets"}
        rightComponent={
          !loading && (
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
                {humanizeNumber(assets.length || 0)}
                <Camera className="w-4 h-4" />
              </p>
            </div>
          )
        }
      />
      {renderContent()}
    </PageLayout>
  )
}
