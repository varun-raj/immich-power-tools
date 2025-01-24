export interface IAsset {
  id: string;
  ownerId: string;
  deviceId: string;
  type: string;
  originalPath: string;
  isFavorite: boolean;
  duration: number | null;
  encodedVideoPath: string | null;
  originalFileName: string;
  thumbhash?: IAssetThumbhash;
  localDateTime: string | Date;
  exifImageWidth: number;
  exifImageHeight: number;
  url: string;
  previewUrl: string;
  videoURL?: string;
  dateTimeOriginal: string;
  orientation?: number | null | string;
  downloadUrl?: string;
}

export interface IAssetThumbhash {
  type: string;
  data: number[];
}
