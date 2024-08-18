import { EXIF_DISTRIBUTION_PATH } from "@/config/routes";
import API from "@/lib/api";

export type ISupportedEXIFColumns = 
  "make" | "model" | "focal-length" | "city" | "state" | "country" | "iso" | "exposureTime" | 'lensModel' | "projectionType";

export const getExifDistribution = async (column: ISupportedEXIFColumns) => {
  return API.get(EXIF_DISTRIBUTION_PATH(column));
};
