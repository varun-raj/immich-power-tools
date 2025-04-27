import "yet-another-react-lightbox/styles.css";
import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";
import { listPotentialAlbumsAssets } from "@/handlers/api/album.handler";
import type { IAsset } from "@/types/asset";
import React, { type MouseEvent, useEffect, useMemo, useState } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { CalendarArrowUp, Hourglass } from "lucide-react";
import Video from "yet-another-react-lightbox/plugins/video";
import { useConfig } from "@/contexts/ConfigContext";
import LazyGridImage from "@/components/ui/lazy-grid-image";

export default function PotentialAlbumsAssets() {
  const { exImmichUrl } = useConfig();
  const {
    selectedIds,
    assets,
    updateContext,
    config
  } = usePhotoSelectionContext();
  const { startDate } = config;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [index, setIndex] = useState(-1);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

  const fetchAssets = async () => {
    if (!startDate) return;
    setLoading(true);
    updateContext({
      assets: [],
      selectedIds: [],
    });
    return listPotentialAlbumsAssets({ startDate })
      .then((fetchedAssets) => updateContext({ assets: fetchedAssets }))
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const images = useMemo(() => {
    const sortedAssets = [...assets].sort((a, b) => {
      try {
        return new Date(a.dateTimeOriginal ?? 0).getTime() - new Date(b.dateTimeOriginal ?? 0).getTime();
      } catch {
        return 0;
      }
    });

    return sortedAssets.map((p) => ({
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
            <a href={`${exImmichUrl}/photos/${p.id}`} target="_blank" rel="noreferrer">
              Open in Immich
            </a>
          ),
        },
      ],
    }));
  }, [assets, selectedIds, exImmichUrl]);


  const slides = useMemo(
    () =>
      images.map(({ original, width, height, type, videoURL}) => ({
        src: original,
        width,
        height,
        type: (type === "VIDEO" ? "video" : "image") as any,
        sources:
          type === "VIDEO"
            ? [
                {
                  src: videoURL,
                  type: "video/mp4",
                },
              ]
            : [],
      })),
    [images]
  );

  const handleClick = (idx: number, asset: IAsset, event: MouseEvent<HTMLElement>) => {
    if (selectedIds.length > 0 && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        handleSelect(idx, asset, event);
    } else {
        setIndex(idx);
    }
  };

  const handleSelect = (_idx: number, asset: IAsset, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const isPresent = selectedIds.includes(asset.id);

    if (isPresent) {
      if (event.ctrlKey || event.metaKey || selectedIds.length === 1) {
          updateContext({
              selectedIds: selectedIds.filter((id) => id !== asset.id),
          });
      } else if (!event.shiftKey) {
          updateContext({ selectedIds: [asset.id] });
      }
    } else {
      const clickedIndex = images.findIndex((image) => image.id === asset.id);

      if (event.shiftKey && lastSelectedIndex !== -1) {
        const startIndex = Math.min(clickedIndex, lastSelectedIndex);
        const endIndex = Math.max(clickedIndex, lastSelectedIndex);
        if (startIndex >= 0 && endIndex < images.length) {
            const newSelectedIds = images.slice(startIndex, endIndex + 1).map((image) => image.id);
            const combined = event.ctrlKey || event.metaKey ? [...selectedIds, ...newSelectedIds] : newSelectedIds;
            const uniqueSelectedIds = [...new Set(combined)];
            updateContext({ selectedIds: uniqueSelectedIds });
        } else {
            updateContext({ selectedIds: [...selectedIds, asset.id] });
        }
      } else if (event.ctrlKey || event.metaKey) {
        updateContext({ selectedIds: [...selectedIds, asset.id] });
      } else {
        updateContext({ selectedIds: [asset.id] });
      }
      setLastSelectedIndex(clickedIndex);
    }

  };

  useEffect(() => {
    if (startDate) fetchAssets();
  }, [startDate]);

  if (loading)
    return (
      <div className="flex flex-col gap-2 min-h-full justify-center items-center w-full">
        <Hourglass />
        <p className="text-lg">Loading...</p>
      </div>
    );

  if (!startDate)
    return (
      <div className="flex flex-col gap-2 min-h-full justify-center items-center w-full">
        <CalendarArrowUp />
        <p className="text-lg">Please select a date</p>
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          When you select a date from the left, you will see all the potential album
          assets captured on that date
        </p>
      </div>
    );
  return (
    <>
      <Lightbox
        slides={slides}
        plugins={[Captions, Video]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
      <div className="w-full overflow-y-auto max-h-[calc(100vh-60px)]">
        <Gallery
          images={images}
          onClick={handleClick}
          enableImageSelection={true}
          onSelect={handleSelect}
          thumbnailImageComponent={LazyGridImage}
          rowHeight={220}
          margin={3}
          tagStyle={{
            color: "white",
            fontSize: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "2px 4px",
            borderRadius: "3px",
          }}
        />
      </div>
    </>
  );
}
