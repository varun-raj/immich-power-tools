import "yet-another-react-lightbox/styles.css";
import { listAlbumAssets } from "@/handlers/api/album.handler";
import { useConfig } from "@/contexts/ConfigContext";
import { IAlbum, IAlbumPerson } from "@/types/album";
import { IAsset } from "@/types/asset";
import React, { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import { Hourglass } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import LazyGridImage from "@/components/ui/lazy-grid-image";
import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";
import { PERSON_THUBNAIL_PATH } from "@/config/routes";
import Image from "next/image";

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
  const [index, setIndex] = useState(-1);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

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

  const images = useMemo(() => {
    return assets.map((p) => ({
      ...p,
      src: p.url as string,
      original: p.previewUrl as string,
      width: p.exifImageWidth as number,
      height: p.exifImageHeight as number,
      isSelected: selectedIds.includes(p.id),
      orientation: 1,
      tags: [
        {
          title: "Immich Link",
          value: (
            <a href={exImmichUrl + "/photos/" + p.id} target="_blank" rel="noopener noreferrer">
              Open in Immich
            </a>
          ),
        },
      ],
    }));
  }, [assets, selectedIds, exImmichUrl]);

  const slides = useMemo(
    () =>
      images.map(({ original, width, height }) => ({
        src: original,
        width,
        height,
      })),
    [images]
  );

  const handleClick = (idx: number, asset: IAsset, event: MouseEvent<HTMLElement>) => {
    if (selectedIds.length > 0) {
      handleSelect(idx, asset, event);
    } else {
      setIndex(idx);
    }
  };

  const handleSelect = (_idx: number, asset: IAsset, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const isPresent = selectedIds.includes(asset.id);
    if (isPresent) {
      updateContext({
        selectedIds: selectedIds.filter((id) => id !== asset.id),
      });
    } else {
      const clickedIndex = images.findIndex((image) => {
        return image.id === asset.id;
      });
      if (event.shiftKey && lastSelectedIndex !== -1) {
        const startIndex = Math.min(clickedIndex, lastSelectedIndex);
        const endIndex = Math.max(clickedIndex, lastSelectedIndex);
        if (startIndex >= 0 && endIndex < images.length) {
          const newSelectedIds = images.slice(startIndex, endIndex + 1).map((image) => image.id);
          const allSelectedIds = [...selectedIds, ...newSelectedIds];
          const uniqueSelectedIds = [...new Set(allSelectedIds)];
          updateContext({ selectedIds: uniqueSelectedIds });
        } else {
          console.warn("Shift-select index out of bounds");
          updateContext({ selectedIds: [...selectedIds, asset.id] });
        }
      } else {
        updateContext({ selectedIds: [...selectedIds, asset.id] });
      }
      setLastSelectedIndex(clickedIndex);
    }
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
    <>
      
      <Lightbox
        slides={slides}
        plugins={[Captions]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
      <div className="w-full p-2 overflow-y-auto max-h-[calc(100vh-60px)]">
        <Gallery
          images={images}
          onClick={handleClick}
          enableImageSelection={true}
          onSelect={handleSelect}
          thumbnailImageComponent={LazyGridImage}
          tagStyle={{
            color: "white",
            fontSize: "12px",
            backgroundColor: "rgba(0, 0, 0)",
            padding: "2px",
            borderRadius: "5px",
          }}
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
    </>
  );
}
