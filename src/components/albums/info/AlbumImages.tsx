import "yet-another-react-lightbox/styles.css";
import { listAlbumAssets } from "@/handlers/api/album.handler";
import { useConfig } from "@/contexts/ConfigContext";
import { IAlbum } from "@/types/album";
import { IAsset } from "@/types/asset";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Hourglass } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import AssetGrid from "@/components/shared/AssetGrid";
import PhotoSelectionContext, {
  IPhotoSelectionContext,
} from "@/contexts/PhotoSelectionContext";

interface AlbumImagesProps {
  album: IAlbum;
}

interface IAssetFilter {
  faceId?: string;
  page: number;
}
export default function AlbumImages({ album }: AlbumImagesProps) {
  const { exImmichUrl } = useConfig();
  const router = useRouter();
  const { faceId } = router.query as { faceId: string };
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<IAssetFilter>({
    faceId,
    page: 1,
  });
  const [hasMore, setHasMore] = useState(true);

  // Initialize context state
  const [contextState, setContextState] = useState<IPhotoSelectionContext>({
    selectedIds: [],
    assets: [],
    config: {},
    updateContext: (newConfig: Partial<IPhotoSelectionContext>) => {
      setContextState((prevState) => ({
        ...prevState,
        ...newConfig,
        // No deep merge needed for config here as it's simple
        config: newConfig.config
          ? { ...prevState.config, ...newConfig.config }
          : prevState.config,
      }));
    },
  });

  const fetchAssets = async () => {
    setLoading(true);
    return listAlbumAssets(album.id, filters)
      .then((newAssets) => {
        if (filters.page === 1) {
          setAssets(newAssets);
        } else {
          setAssets((prevAssets) => [...prevAssets, ...newAssets]);
        }
        setHasMore(newAssets.length === 100);
      })
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (album.id) {
      fetchAssets();
    }
  }, [album.id, filters]);

  useEffect(() => {
    setFilters({
      faceId,
      page: 1,
    });
    setAssets([]);
    setHasMore(true);
  }, [faceId]);

  if (loading && filters.page === 1)
    return (
      <div className="flex flex-col gap-2 h-full justify-center items-center w-full">
        <Hourglass />
        <p className="text-lg">Loading...</p>
      </div>
    );

  if (errorMessage) {
    return (
      <div className="p-4 text-red-500">
        Error loading images: {errorMessage}
      </div>
    );
  }

  return (
    <PhotoSelectionContext.Provider
      value={{ ...contextState, updateContext: contextState.updateContext }}
    >
      <div className="w-full p-2">
        <AssetGrid assets={assets} />
        {hasMore && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => {
              setFilters({
                ...filters,
                page: filters.page + 1,
              });
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </PhotoSelectionContext.Provider>
  );
}
