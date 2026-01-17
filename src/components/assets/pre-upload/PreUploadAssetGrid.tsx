import "yet-another-react-lightbox/styles.css";

import { IDeviceAsset } from '@/types/asset';
import React, {
  useEffect,
  useMemo,
  useState
} from 'react';
import Lightbox from 'yet-another-react-lightbox';
import { Gallery } from "react-grid-gallery";
import Video from "yet-another-react-lightbox/plugins/video";
import { useConfig } from '@/contexts/ConfigContext';
import LazyGridImage from "@/components/ui/lazy-grid-image";
import { useDevicePhotoSelectionContext } from "@/contexts/DevicePhotoSelectionContext";
import PreUploadAssetState, { AssetStatus } from "./PreUploadAssetStatus";
import { UploadItemStatus, useUploadContext } from "@/contexts/UploadContext"

function PreUploadAssetGrid () {
  const [index, setIndex] = useState(-1);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);
  const { exImmichUrl } = useConfig();

  const { state: { assets, selectedChecksums }, dispatch } = useDevicePhotoSelectionContext();
  const { state: uploadState } = useUploadContext();

  const handleClick = (index: number, asset: IDeviceAsset, event: React.MouseEvent<HTMLElement>) => {
    if (selectedChecksums.length > 0) {
      handleSelect(index, asset, event);
    } else {
      setIndex(index);
    }
  };

  const handleSelect = (_idx: number, asset: IDeviceAsset, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const isPresent = selectedChecksums.includes(asset.checksum);

    if (isPresent) {
      const newSelected = selectedChecksums.filter(c => c !== asset.checksum);
      dispatch({ type: "SET_SELECTED", payload: newSelected });
    } else {
      const clickedIndex = images.findIndex(img => img.checksum === asset.checksum);

      if (event.shiftKey) {
        const start = Math.min(clickedIndex, lastSelectedIndex);
        const end = Math.max(clickedIndex, lastSelectedIndex);

        const range = images.slice(start, end + 1).map(img => img.checksum);
        const merged = [...new Set([...selectedChecksums, ...range])];

        dispatch({ type: "SET_SELECTED", payload: merged });
      } else {
        const newSelected = [...selectedChecksums, asset.checksum];
        dispatch({ type: "SET_SELECTED", payload: newSelected });
      }

      setLastSelectedIndex(clickedIndex);
    }
  };

  const slides = useMemo(() => {
    return assets.map(asset => ({
      ...asset,
      orientation: 1,
      src: asset.previewUrl as string,
      type: (asset.type === "video" ? "video" : "image") as any,
      height: asset.exifImageHeight,
      width: asset.exifImageWidth,
      sources:
      asset.type === "video"
      ? [
        {
          src: asset.videoURL,
          type: "video/mp4",
        },
      ]
      : undefined,
      thumbnailStyle: {
        border: "4px solid red",
        borderRadius: "6px",
        boxSizing: "border-box"
      }
    }));
  }, [assets]);

  const images = useMemo(() => {
    return assets.map(p => {
      const isSelected = selectedChecksums.includes(p.checksum);
      const uploadStatus = uploadState.uploads.find(upl => upl.asset.checksum === p.checksum)?.status;

      const status = getStatus(p, isSelected, uploadStatus);
      const tags = getTags(p, uploadStatus);

      return {
        ...p,
        src: p.previewUrl as string,
        original: p.previewUrl as string,
        width: p.exifImageWidth / 10,
        height: p.exifImageHeight / 10,
        isSelected,
        isVideo: p.type === "video",
        tags,
        thumbnailCaption: <PreUploadAssetState state={status} />
      };
    });
  }, [assets, selectedChecksums, uploadState.uploads]);

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      dispatch({ type: "SET_SELECTED", payload: [] });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [images]);


  const getStatus = (deviceAsset: IDeviceAsset, isSelected: boolean, uploadStatus?: UploadItemStatus): AssetStatus => {
      if (deviceAsset.deletedAt) {
        return "EXIST";
      }
      else if (deviceAsset.id || uploadStatus === "success") {
        return "EXIST";
      }
      if (deviceAsset.id === null) {
        return isSelected ? "SELECTED" : "MISSING";
      }
      if (uploadStatus === "pending" || uploadStatus === "uploading") {
        return "UPLOADING"
      }
      return "UNKNOWN";
  }

  const getTags = (deviceAsset: IDeviceAsset, uploadStatus?: UploadItemStatus) => {
    const tags = [];

      if (deviceAsset.deletedAt) {
        const link = `${exImmichUrl}/trash/photos/${deviceAsset.id}`
        tags.push({
          title: "Immich Trash Link",
          value: (
            <a href={link} target="_blank" rel="noopener noreferrer">
            In the trash
            </a>
          )
        });
        tags.push({
          title: "Immich Link",
          value: (
            <a href={link} target="_blank" rel="noopener noreferrer">
            Open in Immich
            </a>
          )
        });
      }
      else if (deviceAsset.id || uploadStatus === "success") {
        tags.push({
          title: "Immich Link",
          value: (
            <a
            href={`${exImmichUrl}/photos/${deviceAsset.id}`}
            target="_blank"
            rel="noopener noreferrer"
            >
            Open in Immich
            </a>
          )
        });
      }

      return tags;
}


  return (
    <div>
      <Lightbox
        slides={slides}
        plugins={[Video]}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />

      <Gallery
        images={images}
        onClick={handleClick}
        enableImageSelection={true}
        thumbnailImageComponent={LazyGridImage}
        onSelect={handleSelect}
      />
    </div>
  );
}

PreUploadAssetGrid.displayName = "PreUploadAssetGrid";
export default PreUploadAssetGrid;
