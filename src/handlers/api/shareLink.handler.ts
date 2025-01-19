
import {
  SHARE_LINK_ASSETS_PATH,
  SHARE_LINK_GENERATE_PATH,
  SHARE_LINK_PATH,
  SHARE_LINK_PEOPLE_PATH 
} from "@/config/routes";
import API from "@/lib/api";
import { ShareLinkFilters } from "@/types/shareLink";

export const getShareLinkInfo = async (token: string) => {
  return API.get(SHARE_LINK_PATH(token));
}

export const getShareLinkAssets = async (token: string, filters: ShareLinkFilters) => {
  return API.get(SHARE_LINK_ASSETS_PATH(token), filters);
} 

export const generateShareLink = async (filters: ShareLinkFilters) => {
  return API.post(SHARE_LINK_GENERATE_PATH, filters);
} 

export const getShareLinkPeople = async (token: string) => {
  return API.get(SHARE_LINK_PEOPLE_PATH(token));
} 