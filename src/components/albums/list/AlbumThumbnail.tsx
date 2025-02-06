import React, { useMemo, useState } from 'react'

import Link from 'next/link';
import { humanizeBytes, humanizeNumber, pluralize } from '@/helpers/string.helper';
import LazyImage from '@/components/ui/lazy-image';
import { ASSET_THUMBNAIL_PATH } from '@/config/routes';
import { IAlbum } from '@/types/album';
import { formatDate } from '@/helpers/date.helper';
import { Checkbox } from '@/components/ui/checkbox';
import { differenceInDays } from 'date-fns';
import { Calendar, Camera } from 'lucide-react';

interface IAlbumThumbnailProps {
  album: IAlbum;
  onSelect: (checked: boolean) => void;
  selected: boolean;
}
export default function AlbumThumbnail({ album, onSelect, selected }: IAlbumThumbnailProps) {
  const [isSelected, setIsSelected] = useState(selected);

  const numberOfDays = useMemo(() => {
    return differenceInDays(album.lastPhotoDate, album.firstPhotoDate);
  }, [album.firstPhotoDate, album.lastPhotoDate]);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative group">
      <label className="block relative ">
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
        <div className="absolute bottom-0 w-full bg-gray-800/70 text-white text-center text-xs font-bold py-1 group-hover:hidden">
          {album.firstPhotoDate ? formatDate(album.firstPhotoDate?.toString(), 'MMM d, yyyy') : ''} - {album.lastPhotoDate ? formatDate(album.lastPhotoDate?.toString(), 'MMM d, yyyy') : ''}
        </div>
        <Checkbox
          defaultChecked={isSelected}
          onCheckedChange={onSelect}
          className="absolute top-2 left-2 w-6 h-6 rounded-full border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        />
      </label>
      <div className="items-center gap-2 absolute top-2 right-2 group-hover:hidden flex ">
        <div className="bg-gray-800 flex items-center gap-1 text-white text-xs py-1 px-2 rounded">
          
          <Camera size={12} />
          {humanizeNumber(album.assetCount)}
        </div>
        <p className="bg-gray-800 flex items-center gap-1 text-white text-xs py-1 px-2 rounded">
        {numberOfDays === 0 ? '1 day' : `${numberOfDays.toLocaleString() } days`} <Calendar size={12} />
      </p>
      </div>
      <div className="p-4">
        <Link href={`/albums/${album.id}`}>
          <h2 className="text-md font-semibold truncate">{album.albumName}</h2>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-700 dark:text-gray-500">{humanizeNumber(album.faceCount)} {
          pluralize(album.faceCount, 'person', 'people')
        } </p>
          <p className="text-xs text-gray-700 dark:text-gray-500">{humanizeBytes(parseInt(album.size))}</p>
        </div>
      </div>
    </div>
  )
}
