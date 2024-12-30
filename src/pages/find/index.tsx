import "yet-another-react-lightbox/styles.css";
import FindInput from '@/components/find/FindInput';
import PageLayout from '@/components/layouts/PageLayout';
import Header from '@/components/shared/Header';
import Loader from '@/components/ui/loader';
import { ASSET_PREVIEW_PATH, ASSET_THUMBNAIL_PATH } from '@/config/routes';
import { useConfig } from '@/contexts/ConfigContext';
import { findAssets } from '@/handlers/api/asset.handler';
import { IAsset } from '@/types/asset';
import { Captions, Megaphone, Search, Speaker, TriangleAlert, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox';
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function FindPage() {

  const [index, setIndex] = useState(-1);
  const { geminiEnabled, exImmichUrl } = useConfig();
  const [query, setQuery] = useState('');
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const slides = useMemo(
    () =>
      assets.map((asset) => ({
        src: ASSET_PREVIEW_PATH(asset.id),
        width: 1000,
        height: 1000,
      })),
    [assets]
  );

  
  const handleSearch = (query: string) => {
    setQuery(query);
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
    if (loading) {
      return <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    }
    else if (query.length === 0) {
      return <div className="flex justify-center flex-col gap-2 items-center h-full">
        <Search className='w-10 h-10 text-muted-foreground' />
        <p className='text-lg font-bold'>Search for photos in natural language</p>
        <p className='text-sm text-muted-foreground'>
          Example: Sunset photos from last week. Use <kbd className='bg-zinc-200 text-black dark:text-white px-1 py-0.5 rounded-md dark:bg-zinc-500'>@</kbd> to search for photos of a specific person.
        </p>
        <p className='text-xs text-muted-foreground text-center flex gap-1 items-center'>
          <span>Power tools uses Google Gemini only for parsing your query. None of your data is sent to Gemini.</span>
        </p>
      </div>
    }
    else if (assets.length === 0) {
      return <div className="flex justify-center items-center h-full">
        No results found
      </div>
    }
    return (
      <>
       <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
        <div className="grid grid-cols-5 gap-4 p-2">
          {assets.map((asset, idx) => (
            <div key={asset.id} className='w-full h-[200px] rounded-md overflow-hidden relative'>
              <Link href={`${exImmichUrl}/photos/${asset.id}`} 
                target="_blank" 
                className='absolute top-2 right-2 text-xs'>
                Open in Immich
              </Link>
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
                onClick={() => setIndex(idx)}
              />
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <PageLayout>
      <Header leftComponent="Find" />
      {geminiEnabled ? (
        <>
          <div className="flex flex-col gap-4 p-2">
            <FindInput onSearch={handleSearch} />
          </div>
          {renderContent()}
        </>
      ) : (
        <div className="flex justify-center py-10 items-center h-full flex-col gap-2">
          <WandSparkles className='w-10 h-10 text-muted-foreground' />
          <p className='text-lg font-semibold'>Google Gemini is not enabled</p>
          <p className='text-sm text-muted-foreground max-w-md text-center'>
            Currently, the Power Tools Find is relying on Google Gemini for parsing the query.
            Please enable Gemini by adding <kbd className='bg-zinc-200 text-black dark:text-white px-1 py-0.5 rounded-md dark:bg-zinc-500'>GEMINI_API_KEY</kbd> in the <kbd className='bg-zinc-200 text-black dark:text-white px-1 py-0.5 rounded-md dark:bg-zinc-500'>.env</kbd> file.
          </p>
          <div className="border border-l-4 border-zinc-200 dark:border-zinc-500 rounded-md p-2">
            <p className='text-xs text-muted-foreground text-center flex gap-1 items-center'>
              <span>Power tools uses Google Gemini only for parsing your query. None of your data is sent to Gemini.</span>
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
