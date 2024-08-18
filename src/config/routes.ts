export const BASE_API_ENDPOINT = '/api';
export const BASE_PROXY_ENDPOINT = BASE_API_ENDPOINT + '/immich-proxy';

export const LIST_PEOPLE_PATH = BASE_PROXY_ENDPOINT + "/people";
export const SEARCH_PEOPLE_PATH = BASE_PROXY_ENDPOINT + "/search/person";
export const PERSON_THUBNAIL_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/thumbnail/" + id;
export const UPDATE_PERSON_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/people/" + id;
export const MERGE_PERSON_PATH = (id: string) => BASE_PROXY_ENDPOINT + "/people/" + id + "/merge";


export const EXIF_DISTRIBUTION_PATH = (column: string) => BASE_API_ENDPOINT + "/analytics/exif/" + column;
