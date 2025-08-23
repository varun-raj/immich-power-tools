import { listAlbumAssets } from "@/handlers/api/album.handler";
import { useConfig } from "@/contexts/ConfigContext";
import { IAlbum, IAlbumPerson } from "@/types/album";
import { IAsset } from "@/types/asset";
import React, { useEffect, useMemo, useState } from "react";
import { Hourglass } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";
import { PERSON_THUBNAIL_PATH } from "@/config/routes";
import Image from "next/image";
import AssetGrid from "@/components/shared/AssetGrid";

interface AlbumImagesProps {
  album: IAlbum;
  selectedPerson: IAlbumPerson | null;
}

interface IAssetFilter {
  faceId?: string;
  page: number;
}

export default function AlbumImages({ album, selectedPerson }: AlbumImagesProps) {
  const { exImmichUrl } = useConfig();
  const router = useRouter();
  const { faceId } = router.query as { faceId: string };

  // Use context from parent instead of managing own
  const { selectedIds, updateContext, assets } = usePhotoSelectionContext();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<IAssetFilter>({
    faceId,
    page: 1,
  });
  const [hasMore, setHasMore] = useState(true);

  const fetchAssets = async () => {
    setLoading(true);
    return listAlbumAssets(album.id, filters)
      .then((newAssets) => {
        if (filters.page === 1) {
          updateContext({ assets: newAssets });
        } else {
          updateContext({ assets: [...assets, ...newAssets] });
        }
        setHasMore(newAssets.length === 100);
      })
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const processedAssets = useMemo(() => {
    return assets.map((asset) => ({
      ...asset,
      tags: [
        {
          title: "Immich Link",
          value: (
            <a href={exImmichUrl + "/photos/" + asset.id} target="_blank" rel="noopener noreferrer">
              Open in Immich
            </a>
          ),
        },
      ],
    }));
  }, [assets, exImmichUrl]);

  const handleSelectionChange = (ids: string[]) => {
    updateContext({ selectedIds: ids });
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
    updateContext({ assets: [], selectedIds: [] });
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
    <div className="w-full p-2 overflow-y-auto max-h-[calc(100vh-60px)]">
      <AssetGrid
        assets={processedAssets}
        isInternal={true}
        selectable={true}
        onSelectionChange={handleSelectionChange}
      />
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
  );
}
