import "yet-another-react-lightbox/styles.css";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";
import { listPotentialAlbumsAssets } from "@/handlers/api/album.handler";
import type { IAsset } from "@/types/asset";
import React, { type MouseEvent, useEffect, useMemo, useState } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox, { SlideImage, SlideTypes } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { CalendarArrowDown, CalendarArrowUp, Hourglass } from "lucide-react";
import Video from "yet-another-react-lightbox/plugins/video";
import { useConfig } from "@/contexts/ConfigContext";
import LazyGridImage from "@/components/ui/lazy-grid-image";

export default function PotentialAlbumsAssets() {
  const { exImmichUrl } = useConfig();
  const { startDate, selectedIds, assets, updateContext } =
    usePotentialAlbumContext();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [index, setIndex] = useState(-1);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

  const fetchAssets = async () => {
    setLoading(true);
    updateContext({
      assets: [],
    });
    return listPotentialAlbumsAssets({ startDate })
      .then((assets) => updateContext({ assets }))
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


  const handleSelect = (_idx: number, asset: IAsset, event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const isPresent = selectedIds.includes(asset.id);
    if (isPresent) {
      updateContext({
        selectedIds: selectedIds.filter((id) => id !== asset.id),
      });
    } else {
      const clickedIndex = images.findIndex((image) => {
        return image.id === asset.id
      });
      if (event.shiftKey) {
        const startIndex = Math.min(clickedIndex, lastSelectedIndex);
        const endIndex = Math.max(clickedIndex, lastSelectedIndex);
        const newSelectedIds = images.slice(startIndex, endIndex + 1).map((image) => image.id);
        const allSelectedIds = [...selectedIds, ...newSelectedIds];
        const uniqueSelectedIds = [...new Set(allSelectedIds)];
        updateContext({ selectedIds: uniqueSelectedIds });
      } else {
        updateContext({ selectedIds: [...selectedIds, asset.id] });
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
        <p className="text-sm text-zinc-700">
          When you select a date from the left, you will see all the orphan
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
          onClick={setIndex}
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
      </div>
    </>
  );
}
