import { ADD_ASSETS_ALBUMS_PATH, ALBUM_ASSETS_PATH, ALBUM_INFO_PATH, ALBUM_PEOPLE_PATH, CREATE_ALBUM_PATH, DELETE_ALBUMS_PATH, LIST_ALBUMS_PATH, LIST_POTENTIAL_ALBUMS_ASSETS_PATH, LIST_POTENTIAL_ALBUMS_DATES_PATH, SHARE_ALBUMS_PATH } from "@/config/routes";
import { cleanUpAsset } from "@/helpers/asset.helper";
import API from "@/lib/api";
import { IAlbumCreate } from "@/types/album";
import { IAsset } from "@/types/asset";

interface IPotentialAlbumsDatesFilters {
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}
export interface IPotentialAlbumsDatesResponse {
  date: string;
  asset_count: number;
}

export const listPotentialAlbumsDates = async (filters: IPotentialAlbumsDatesFilters): Promise<IPotentialAlbumsDatesResponse[]> => {
  return API.get(LIST_POTENTIAL_ALBUMS_DATES_PATH, filters);
}

export const listPotentialAlbumsAssets = async (filters: IPotentialAlbumsDatesFilters): Promise<IAsset[]> => {
  return API.get(LIST_POTENTIAL_ALBUMS_ASSETS_PATH, filters).then((assets) => assets.map(cleanUpAsset));
}

export const listAlbums = async (filters?: { sortBy?: string, sortOrder?: string }) => {
  return API.get(LIST_ALBUMS_PATH, filters);
}
export const getAlbumInfo = async (id: string) => {
  return API.get(ALBUM_INFO_PATH(id));
}

export const getAlbumPeople = async (id: string) => {
  return API.get(ALBUM_PEOPLE_PATH(id));
}

export const listAlbumAssets = async (id: string, filters: { faceId?: string }) => {
  return API.get(ALBUM_ASSETS_PATH(id), filters).then((assets) => assets.map(cleanUpAsset));
}

export const addAssetToAlbum = async (albumId: string, assetIds: string[]) => {
  return API.put(ADD_ASSETS_ALBUMS_PATH(albumId), { ids: assetIds });
}

export const createAlbum = async (albumData: IAlbumCreate) => {
  return API.post(CREATE_ALBUM_PATH, albumData);
}

export const shareAlbums = async (albums: { albumId: string, allowDownload: boolean, allowUpload: boolean, showMetadata: boolean }[]) => {
  return API.post(SHARE_ALBUMS_PATH, { albums });
}

export const deleteAlbums = async (albumIds: string[]) => {
  return API.delete(DELETE_ALBUMS_PATH, { albumIds });
}