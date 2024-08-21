import { Button } from "@/components/ui/button";
import { listGoogleAlbums } from "@/handlers/integration.handler";
import React, { useEffect, useState } from "react";

interface IGooglePhotosAlbum {
  id: string;
  title: string;
  mediaItemsCount: number;
  coverPhotoBaseUrl: string;
  productUrl: string;
}

export default function GASelectAlbum(
  { onSelect }: { onSelect: (album: IGooglePhotosAlbum) => void }
) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [albums, setAlbums] = useState<IGooglePhotosAlbum[] | null>(null);

  const fetchData = async () => {
    return listGoogleAlbums()
      .then((data) => {
        setAlbums(data.albums);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  if (!albums) {
    return <div>No albums found</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {albums.map((album) => (
        <div key={album.id} className="border rounded-lg overflow-hidden shadow-lg">
          <img src={album.coverPhotoBaseUrl} alt={album.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="font-bold text-lg">{album.title}</div>
            <div className="text-gray-500">{album.mediaItemsCount} photos</div>
            <Button onClick={() => onSelect(album)}>Choose</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
