import "yet-another-react-lightbox/styles.css";

import { IAsset } from '@/types/asset';
import React, { useMemo, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox';
import { Gallery } from "react-grid-gallery";
import LazyGridImage from "../ui/lazy-grid-image";
import Download from "yet-another-react-lightbox/plugins/download";


interface AssetGridProps {
  assets: IAsset[];
  isInternal?: boolean;
  selectable?: boolean;
}

export default function AssetGrid({ assets, isInternal = true, selectable = false }: AssetGridProps) {
  const [index, setIndex] = useState(-1);

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
      orientation: 1
    }));
  }, [assets]);

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
        onClick={setIndex}
        enableImageSelection={selectable}
        thumbnailImageComponent={LazyGridImage}
      />
    </div>
  );
}
