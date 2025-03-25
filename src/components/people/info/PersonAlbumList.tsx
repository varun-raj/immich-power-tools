import { ASSET_THUMBNAIL_PATH } from '@/config/routes';
import { useConfig } from '@/contexts/ConfigContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react'

interface PersonAlbumListProps {
  albums: {
    id: string;
    name: string;
    thumbnail: string;
    assetCount: number;
    lastAssetYear: number;
  }[]
  personId: string;
}

export const PersonAlbum = ({ album, personId }: { album: PersonAlbumListProps['albums'][number], personId: string }) => {
  const { exImmichUrl } = useConfig();
  return (
    <div key={album.id} className="flex flex-col gap-1 w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2">
      <div className="relative w-full h-[200px]">
        <Image src={ASSET_THUMBNAIL_PATH(album.thumbnail)}
          alt={album.name}
          width={100}
          height={100}
          className="rounded-md w-full h-full object-cover" />
      </div>
      <Link href={`${exImmichUrl}/albums/${album.id}`} target="_blank" className="text-sm font-medium truncate">{album.name}</Link>
      <span className="text-sm text-gray-500 truncate">{album.assetCount} Occurences</span>
    </div>
  )
}
export default function PersonAlbumList({ albums, personId }: PersonAlbumListProps) {

  const groupedAlbums = useMemo(() => {
    const years: {
      label: number;
      albums: {
        id: string;
        name: string;
        thumbnail: string;
        assetCount: number;
        lastAssetYear: number;
      }[];
    }[] = [];
    const uniqueYears = albums.map((album) => album.lastAssetYear).filter((year, index, self) => self.indexOf(year) === index);
    uniqueYears.forEach((year) => {
      years.push({ label: year, albums: albums.filter((album) => album.lastAssetYear === year) });
    });
    return years.sort((a, b) => b.label - a.label);
  }, [albums]);

  return (
    <div className='flex flex-col gap-10'>
      {groupedAlbums.map((year) => (
        <div key={year.label} className="flex flex-col gap-2 w-full">
          {/* Country */}
          <span className="font-medium text-xl">{year.label}</span>
          {/* Cities */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-5 w-full'>
            {year.albums.map((album) => (
              <PersonAlbum key={album.id} album={album} personId={personId} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
