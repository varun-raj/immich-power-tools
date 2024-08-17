export const BASE_ENDPOINT = '/api/immich-proxy';

export const LIST_PEOPLE_PATH = BASE_ENDPOINT + "/people";
export const SEARCH_PEOPLE_PATH = BASE_ENDPOINT + "/search/person";
export const PERSON_THUBNAIL_PATH = (id: string) => BASE_ENDPOINT + "/thumbnail/" + id;
export const UPDATE_PERSON_PATH = (id: string) => BASE_ENDPOINT + "/people/" + id;
export const MERGE_PERSON_PATH = (id: string) => BASE_ENDPOINT + "/people/" + id + "/merge";