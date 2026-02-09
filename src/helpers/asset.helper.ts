import { ASSET_PREVIEW_PATH, ASSET_SHARE_THUMBNAIL_PATH, ASSET_THUMBNAIL_PATH, ASSET_VIDEO_PATH } from "@/config/routes"
import { IAsset, IAssetExif, IDeviceAsset } from "@/types/asset"

export const cleanUpAsset = (asset: IAsset): IAsset => {
  return {
    ...asset,
    url: ASSET_THUMBNAIL_PATH(asset.id),
    previewUrl: ASSET_PREVIEW_PATH(asset.id),
    videoURL: ASSET_VIDEO_PATH(asset.id),
  }
}


export const cleanUpShareAsset = (asset: IAsset, token: string): IAsset => {
  return {
    ...asset,
    url: ASSET_SHARE_THUMBNAIL_PATH({ id: asset.id, size: "thumbnail", token, isPeople: false }),
    downloadUrl: ASSET_SHARE_THUMBNAIL_PATH({ id: asset.id, size: "original", token, isPeople: false }),
    previewUrl: ASSET_SHARE_THUMBNAIL_PATH({ id: asset.id, size: "preview", token, isPeople: false }),
    videoURL: ASSET_SHARE_THUMBNAIL_PATH({ id: asset.id, size: "video", token, isPeople: false }),
  }
}

export const cleanUpAssets = (assets: IAsset[]): IAsset[] => {
  return assets.map(cleanUpAsset);
}

function isRotated90CW(orientation: number) {
  return orientation === 5 || orientation === 6 || orientation === 90;
}

function isRotated270CW(orientation: number) {
  return orientation === 7 || orientation === 8 || orientation === -90;
}

export function isFlipped(orientation?: string | null) {
  const value = Number(orientation);
  return value && (isRotated270CW(value) || isRotated90CW(value));
}

export function sortAssetsByDateTime<A extends IAsset | IDeviceAsset>(
  assets: A[],
  order: "asc" | "desc"
): A[] {
  return [...assets].sort((a, b) => {
    const tA = new Date(a.dateTimeOriginal).getTime();
    const tB = new Date(b.dateTimeOriginal).getTime();
    return order === "asc" ? tA - tB : tB - tA;
  });
}
