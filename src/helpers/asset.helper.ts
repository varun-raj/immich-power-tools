import { ASSET_PREVIEW_PATH, ASSET_THUMBNAIL_PATH, ASSET_VIDEO_PATH, PERSON_THUBNAIL_PATH } from "@/config/routes"
import { IPerson } from "@/types/person"
import { parseDate } from "./date.helper"
import { IAsset } from "@/types/asset"


export const cleanUpAsset = (asset: IAsset): IAsset => {
  return {
    ...asset,
    url: ASSET_THUMBNAIL_PATH(asset.id),
    previewUrl: ASSET_PREVIEW_PATH(asset.id),
    videoURL: ASSET_VIDEO_PATH(asset.id),
  }
}
