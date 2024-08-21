import { Button } from "@/components/ui/button";
import { useGAImportConfig } from "@/contexts/GAImportContext";
import { listGoogleMedia } from "@/handlers/integration.handler";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IGooglePhotosMediaItem {
  id: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
}

export default function GASelectMedia({
  onSelect,
}: {
  onSelect: (album: IGooglePhotosMediaItem) => void;
}) {
  const { googleAlbumId } = useGAImportConfig();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<IGooglePhotosMediaItem[] | null>(
    null
  );

  const fetchData = async () => {
    if (!googleAlbumId) return Promise.resolve();
    return listGoogleMedia(googleAlbumId)
      .then((data) => {
        setMediaItems(data.mediaItems);
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
  if (!mediaItems) {
    return <div>No mediaItems found</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {mediaItems.map((album) => (
        <div
          key={album.id}
          className="border rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={album.baseUrl}
            alt={album.id}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="font-bold text-sm truncate">{album.filename}</div>
            <Link href={album.baseUrl + "=d"} target="_blank">
              Download
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
