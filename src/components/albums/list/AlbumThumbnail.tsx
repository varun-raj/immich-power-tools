import React, { useMemo } from 'react'

import Link from 'next/link';
import { useConfig } from '@/contexts/ConfigContext';
import { humanizeNumber } from '@/helpers/string.helper';
import LazyImage from '@/components/ui/lazy-image';
import { ASSET_THUMBNAIL_PATH } from '@/config/routes';
import { IAlbum } from '@/types/album';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/helpers/date.helper';
import { Checkbox } from '@/components/ui/checkbox';
import { differenceInDays } from 'date-fns';
import { FaceIcon } from '@radix-ui/react-icons';
import { Camera, Image, User } from 'lucide-react';

interface IAlbumThumbnailProps {
  album: IAlbum;
  onSelect: (checked: boolean) => void;
}
export default function AlbumThumbnail({ album, onSelect }: IAlbumThumbnailProps) {
  const numberOfDays = useMemo(() => {
    return differenceInDays(album.lastPhotoDate, album.firstPhotoDate);
  }, [album.firstPhotoDate, album.lastPhotoDate]);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative">
      <label className="block relative">
        <LazyImage
          src={ASSET_THUMBNAIL_PATH(album.albumThumbnailAssetId)}
          alt={album.albumName}
          title={album.albumName}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
          }}
        />
        <div className="absolute bottom-0 w-full bg-gray-800/70 text-white text-center text-xs font-bold py-1">
          {formatDate(album.firstPhotoDate.toString(), 'MMM d, yyyy')} - {formatDate(album.lastPhotoDate.toString(), 'MMM d, yyyy')}
        </div>
        <Checkbox
          onCheckedChange={onSelect}
          className="absolute hidden top-2 left-2 w-6 h-6 rounded-full border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        />
      </label>
      <div className="flex items-center gap-2 absolute top-2 right-2 ">
        <div className="bg-gray-800 flex items-center gap-1 text-white text-xs font-bold py-1 px-2 rounded">
          {humanizeNumber(album.assetCount)} <Camera size={12} />
        </div>
      <p className="bg-gray-800 flex items-center gap-1 text-white text-xs font-bold py-1 px-2 rounded">
        {album.faceCount} <User size={12} />
      </p>
      </div>
      <div className="p-4">
        <Link href={`/albums/${album.id}`}>
          <h2 className="text-md font-semibold truncate">{album.albumName}</h2>
        </Link>
          <p className="text-sm text-gray-700 dark:text-gray-500">{
          numberOfDays === 0 ? '1 day' : `${numberOfDays.toLocaleString() } days`
        }</p>
      </div>
    </div>
  )
}
