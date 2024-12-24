import { GET_FILTERS, REWIND_STATS, SEARCH_PLACES_PATH } from "@/config/routes";
import API from "@/lib/api";
import { IPlace } from "@/types/common";

export const searchPlaces = async (name: string): Promise<IPlace[]> => {
  return API.get(SEARCH_PLACES_PATH, { name });
}


export const getFilters = async () => {
  return API.get(GET_FILTERS);
}

export const getRewindStats = async () => {
  return API.get(REWIND_STATS);
} 