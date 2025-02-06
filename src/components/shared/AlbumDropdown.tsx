import { listAlbums } from '@/handlers/api/album.handler';
import { IAlbum } from '@/types/album';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X } from 'lucide-react';

interface IAlbumDropdownProps {
  albumIds?: string[];
  onChange: (albumIds: string[]) => void;
}
export default function AlbumDropdown({ albumIds, onChange }: IAlbumDropdownProps) {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState(albumIds);

  const fetchAlbums = async () => {
    setLoading(true);
    return listAlbums({
      sortBy: "createdAt",
      sortOrder: "desc",
    }).then((albums) => setAlbums(albums)).catch((error) => setError(error)).finally(() => setLoading(false)) ;
  }

  useEffect(() => {
    fetchAlbums();
  }, []);


  useEffect(() => {
    if (albumIds) {
      setSelectedAlbumIds(albumIds);
    } else {
      setSelectedAlbumIds([]);
    }
  }, [albumIds]);

  return (
    <div>
    <Select 
      onValueChange={(value) => {
        if (value) {
          setSelectedAlbumIds([value])
          onChange([value])
        } else {
          setSelectedAlbumIds([])
          onChange([])
        }
      }} 
      value={selectedAlbumIds?.[0] ?? ""}
    >   
      <SelectTrigger className='!p-2'>
        <SelectValue placeholder={'Select album'} />
      </SelectTrigger>
      <SelectContent>
        {albums.map((album) => (
          <SelectItem key={album.id} value={album.id}>{album.albumName}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
  )
}