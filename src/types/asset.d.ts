export interface IAsset {
  id: string;
  ownerId: string;
  deviceId: string;
  type: string;
  originalPath: string;
  previewPath: string;
  isFavorite: boolean;
  duration: null;
  thumbnailPath: string;
  encodedVideoPath: string;
  originalFileName: string;
  sidecarPath: null;
  thumbhash: IAssetThumbhash;
  deletedAt: null;
  localDateTime: string;
  exifImageWidth: number;
  exifImageHeight: number;
  url: string;
  previewUrl: string;
}

export interface IAssetThumbhash {
  type: string;
  data: number[];
}
