import { ASSET_STATISTICS, EXIF_DISTRIBUTION_PATH } from "@/config/routes";
import API from "@/lib/api";

export type ISupportedEXIFColumns = 
  "make" | "model" | "focal-length" | "city" | "state" | "country" | "iso" | "exposureTime" | 'lensModel' | "projectionType";

export const getExifDistribution = async (column: ISupportedEXIFColumns) => {
  return API.get(EXIF_DISTRIBUTION_PATH(column));
};

export const getAssetStatistics = async () => {
  return API.get(ASSET_STATISTICS);
}