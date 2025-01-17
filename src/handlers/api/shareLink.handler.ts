
import { SHARE_LINK_ASSETS_PATH, SHARE_LINK_GENERATE_PATH, SHARE_LINK_PATH } from "@/config/routes";
import { cleanUpAssets } from "@/helpers/asset.helper";
import API from "@/lib/api";
import { ShareLinkFilters } from "@/types/shareLink";

export const getShareLinkInfo = async (token: string) => {
  return API.get(SHARE_LINK_PATH(token));
}

export const getShareLinkAssets = async (token: string) => {
  return API.get(SHARE_LINK_ASSETS_PATH(token));
} 

export const generateShareLink = async (filters: ShareLinkFilters) => {
  return API.post(SHARE_LINK_GENERATE_PATH, filters);
} 