import "yet-another-react-lightbox/styles.css";

import { IAsset } from '@/types/asset';
import React, { useEffect, useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox';
import { Gallery } from "react-grid-gallery";
import LazyGridImage from "../ui/lazy-grid-image";
import Download from "yet-another-react-lightbox/plugins/download";


interface AssetGridProps {
  assets: IAsset[];
  isInternal?: boolean;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
}

export default function AssetGrid({ assets, isInternal = true, selectable = false, onSelectionChange }: AssetGridProps) {
  const [index, setIndex] = useState(-1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);


  const handleClick = (index: number, asset: IAsset, event: React.MouseEvent<HTMLElement>) => {
    if (selectedIds.length > 0) {
      handleSelect(index, asset, event);
    } else {
      setIndex(index);
    }
  }

  const handleSelect = (_idx: number, asset: IAsset, event: React.MouseEvent<HTMLElement>) => {

    event.stopPropagation();
    const isPresent = selectedIds.includes(asset.id);
    if (isPresent) {
      setSelectedIds(selectedIds.filter((id) => id !== asset.id));
      onSelectionChange?.(selectedIds.filter((id) => id !== asset.id));
    } else {
      const clickedIndex = images.findIndex((image) => {
        return image.id === asset.id;
      });
      if (event.shiftKey) {
        const startIndex = Math.min(clickedIndex, lastSelectedIndex);
        const endIndex = Math.max(clickedIndex, lastSelectedIndex);
        const newSelectedIds = images.slice(startIndex, endIndex + 1).map((image) => image.id);
        const allSelectedIds = [...selectedIds, ...newSelectedIds];
        const uniqueSelectedIds = [...new Set(allSelectedIds)];
        setSelectedIds(uniqueSelectedIds);
        onSelectionChange?.(uniqueSelectedIds);
      } else {
        setSelectedIds([...selectedIds, asset.id]);
        onSelectionChange?.([...selectedIds, asset.id]);
      }
      setLastSelectedIndex(clickedIndex);
    }
  };

  const slides = useMemo(() => {
    return assets.map((asset) => ({
      ...asset,
      orientation: 1,
      src: asset.previewUrl as string,
      type: (asset.type === "VIDEO" ? "video" : "image") as any,
      sources:
        asset.type === "VIDEO"
          ? [
            {
              src: asset.downloadUrl as string,
              type: "video/mp4",
            },
          ]
          : undefined,
      height: asset.exifImageHeight as number,
      width: asset.exifImageWidth as number,
      downloadUrl: asset.downloadUrl as string,
    }));
  }, [assets]);

  const images = useMemo(() => {
    return assets.map((p) => ({
      ...p,
      src: p.url as string,
      original: p.previewUrl as string,
      width: p.exifImageWidth / 10 as number,
      height: p.exifImageHeight / 10 as number,
      orientation: 1,
      isSelected: selectedIds.includes(p.id),
    }));
  }, [assets, selectedIds]);

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setSelectedIds([]);
      onSelectionChange?.([]);
    }
  };

  useEffect(() => {
    // Listen for esc key press and unselect all images
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [images]);

  return (
    <div>
      <Lightbox
        slides={slides}
        plugins={[Download]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
      <Gallery
        images={images}
        onClick={handleClick}
        enableImageSelection={selectable}
        thumbnailImageComponent={LazyGridImage}
        onSelect={handleSelect}
      />
    </div>
  );
}
