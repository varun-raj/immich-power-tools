import "yet-another-react-lightbox/styles.css";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";
import { listPotentialAlbumsAssets } from "@/handlers/api/album.handler";
import { IAsset } from "@/types/asset";
import React, { useEffect, useMemo, useState } from "react";
import { Gallery } from "react-grid-gallery";
import Lightbox, { SlideImage, SlideTypes } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { CalendarArrowDown, CalendarArrowUp, Hourglass } from "lucide-react";
import Video from "yet-another-react-lightbox/plugins/video";

export default function PotentialAlbumsAssets() {
  const { startDate, selectedIds, assets, updateContext } =
    usePotentialAlbumContext();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [index, setIndex] = useState(-1);

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
    }));
  }, [assets, selectedIds]);

  const slides = useMemo(
    () =>
      images.map(({ original, width, height, type, videoURL }) => ({
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

  const handleClick = (idx: number) => setIndex(idx);

  const handleSelect = (_idx: number, asset: IAsset) => {
    const isPresent = selectedIds.includes(asset.id);
    if (isPresent) {
      updateContext({
        selectedIds: selectedIds.filter((id) => id !== asset.id),
      });
    } else {
      updateContext({ selectedIds: [...selectedIds, asset.id] });
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
          onClick={handleClick}
          enableImageSelection={true}
          onSelect={handleSelect}
        />
      </div>
    </>
  );
}
