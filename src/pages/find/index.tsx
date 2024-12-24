import FindInput from '@/components/find/FindInput';
import PageLayout from '@/components/layouts/PageLayout';
import Header from '@/components/shared/Header';
import Loader from '@/components/ui/loader';
import { ASSET_THUMBNAIL_PATH } from '@/config/routes';
import { findAssets } from '@/handlers/api/asset.handler';
import { IAsset } from '@/types/asset';
import Image from 'next/image';
import React, { useState } from 'react'


export default function FindPage() {
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = (query: string) => {
    setLoading(true);
    findAssets(query)
      .then(({ assets }) => {
        setAssets(assets);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const renderContent = () => {
    if (assets.length === 0) {
      return <div className="flex justify-center items-center h-full">
        No results found
      </div>
    }
    else if (loading) {
      return <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    }
    return (
      <div className="grid grid-cols-5 gap-4 p-2">
        {assets.map((asset) => (
          <div key={asset.id} className='w-full h-[200px] rounded-md overflow-hidden'>
            <Image
              src={ASSET_THUMBNAIL_PATH(asset.id)}
              alt={asset.id}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <PageLayout>
      <Header leftComponent="Find" />
      <div className="flex flex-col gap-4 p-2">
        <FindInput onSearch={handleSearch} />
      </div>
      {renderContent()}
    </PageLayout>
  )
}
