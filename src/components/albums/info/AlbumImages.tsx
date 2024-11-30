import "yet-another-react-lightbox/styles.css";
import { listAlbumAssets } from '@/handlers/api/album.handler';
import { useConfig } from '@/contexts/ConfigContext';
import { IAlbum } from '@/types/album'
import { IAsset } from '@/types/asset'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, Hourglass } from 'lucide-react';
import { useRouter } from 'next/router';
import { CalendarArrowUp } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import LazyImage from '@/components/ui/lazy-image';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AlbumImagesProps {
  album: IAlbum

}

interface IAssetFilter {
  faceId?: string
  page: number
}
export default function AlbumImages({ album }: AlbumImagesProps) {
  const { exImmichUrl } = useConfig();
  const router = useRouter();
  const { faceId } = router.query as { faceId: string };
  const [assets, setAssets] = useState<IAsset[]>([])
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<IAssetFilter>({
    faceId,
    page: 1
  })
  const [hasMore, setHasMore] = useState(true)

  const [index, setIndex] = useState(-1);

  const fetchAssets = async () => {
    setLoading(true);
    return listAlbumAssets(album.id, filters)
      .then((assets) => {
        if (filters.page === 1) {
          setAssets(assets)
        } else {
          setAssets([...assets, ...assets])
        }
        setHasMore(assets.length >= 100)
      })
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const images = useMemo(() => {
    return assets.map((p) => ({
      ...p,
      src: p.url as string,
      original: p.previewUrl as string,
      width: p.exifImageWidth as number,
      height: p.exifImageHeight as number,
      // isSelected: selectedIds.includes(p.id),
      tags: [
        {
          title: "Immich Link",
          value: (
            <a href={exImmichUrl + "/photos/" + p.id} target="_blank">
              Open in Immich
            </a>
          ),
        },
      ],
    }));
  }, [assets]);

  const slides = useMemo(
    () =>
      images.map(({ original, width, height }) => ({
        src: original,
        width,
        height,
      })),
    [images]
  );

  const handleClick = (idx: number) => setIndex(idx);

  // const handleSelect = (_idx: number, asset: IAsset) => {
  //   const isPresent = selectedIds.includes(asset.id);
  //   if (isPresent) {
  //     updateContext({
  //       selectedIds: selectedIds.filter((id) => id !== asset.id),
  //     });
  //   } else {
  //     updateContext({ selectedIds: [...selectedIds, asset.id] });
  //   }
  // };

  useEffect(() => {
    fetchAssets();
  }, [album.id, filters]);

  useEffect(() => {
    setFilters({
      faceId,
      page: 1
    })
  }, [faceId])

  if (loading && filters.page === 1)
    return (
      <div className="flex flex-col gap-2 h-full justify-center items-center w-full">
        <Hourglass />
        <p className="text-lg">Loading...</p>
      </div>
    );

  return (
    <div>
      <Lightbox
        slides={slides}
        plugins={[Captions]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="w-full h-[200px] overflow-hidden relative"
            >
            <LazyImage
              loading="lazy"
              key={image.id}
              src={image.original}
              alt={image.originalFileName}
              className='overflow-hidden'
              style={{
                objectPosition: 'center',
                objectFit: 'cover',
                height: '100%',
              }}
              onClick={() => handleClick(images.indexOf(image))}
            />
            <Link
                className="absolute top-2 right-2 bg-white dark:bg-zinc-900 p-1 py-0.5 rounded-md flex items-center gap-1 text-xs"
                target="_blank"
                href={`${exImmichUrl}/photos/${image.id}`}>
                <ExternalLink className="w-3 h-3" />
                Open In Immich
              </Link> 
          </div>
        ))}
      </div>
      {hasMore && <Button variant="outline" className='w-full' onClick={() => {
        setFilters({
          ...filters,
          page: filters.page + 1
        })
      }}
        disabled={loading}
      >
        Load More
      </Button>}
    </div>
  );
}
