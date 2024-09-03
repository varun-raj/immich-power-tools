export const BASE_API_ENDPOINT = '/api';
export const BASE_PROXY_ENDPOINT = BASE_API_ENDPOINT + '/immich-proxy';

export const GET_ME_PATH = BASE_API_ENDPOINT + "/users/me";
export const LOGIN_PATH = BASE_API_ENDPOINT + "/users/login";


export const LIST_PEOPLE_PATH = BASE_API_ENDPOINT + "/people/list";
export const SEARCH_PEOPLE_PATH = BASE_PROXY_ENDPOINT + "/search/person";
export const SIMILAR_FACES_PATH = (id: string) => BASE_API_ENDPOINT + "/people/" + id + "/similar-faces";
export const PERSON_THUBNAIL_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/thumbnail/" + id;
export const UPDATE_PERSON_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/people/" + id;
export const MERGE_PERSON_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/people/" + id + "/merge";


export const EXIF_DISTRIBUTION_PATH = (column: string) => BASE_API_ENDPOINT + "/analytics/exif/" + column;

// Albums
export const LIST_POTENTIAL_ALBUMS_DATES_PATH = BASE_API_ENDPOINT + "/albums/potential-albums-dates";
export const LIST_POTENTIAL_ALBUMS_ASSETS_PATH = BASE_API_ENDPOINT + "/albums/potential-albums-assets";
export const LIST_ALBUMS_PATH = BASE_PROXY_ENDPOINT + "/albums";
export const CREATE_ALBUM_PATH = BASE_PROXY_ENDPOINT + "/albums";
export const ADD_ASSETS_ALBUMS_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/albums/" + id + "/assets";

// Assets
export const LIST_MISSING_LOCATION_DATES_PATH = BASE_API_ENDPOINT + "/assets/missing-location-dates";
export const LIST_MISSING_LOCATION_ASSETS_PATH = BASE_API_ENDPOINT + "/assets/missing-location-assets";
export const UPDATE_ASSETS_PATH = BASE_PROXY_ENDPOINT + "/assets";

export const ASSET_THUMBNAIL_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/asset/thumbnail/" + id;
export const ASSET_PREVIEW_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/asset/thumbnail/" + id + "?size=preview";
export const ASSET_VIDEO_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/asset/video/" + id;

// Location

export const SEARCH_PLACES_PATH = BASE_PROXY_ENDPOINT + "/search/places";