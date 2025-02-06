import { LIST_PEOPLE_PATH, MERGE_PERSON_PATH, SEARCH_PEOPLE_PATH, SIMILAR_FACES_PATH, UPDATE_PERSON_PATH } from "@/config/routes"
import { cleanUpPerson } from "@/helpers/person.helper";
import API from "@/lib/api"
import { IPeopleListResponse, IPerson } from "@/types/person"

type ISortField = "assetCount" | "updatedAt" | "createdAt";

export interface IPersonListFilters {
  page: number | string;
  perPage?: number;
  minimumAssetCount?: number;
  maximumAssetCount?: number;
  sort?: ISortField;
  sortOrder?: "asc" | "desc";
  type?: string;
  query?: string;
  visibility?: "all" | "visible" | "hidden";
}
export const listPeople = (filters: IPersonListFilters): Promise<IPeopleListResponse> => {
  return API.get(LIST_PEOPLE_PATH, filters).then((response) => {
    return {
      ...response,
      people: response.people.map(cleanUpPerson),
    }
  });
}

export const updatePerson = (id: string, data: Partial<{
  name: string;
  birthDate: string | null;
  isHidden: boolean;
}>) => {
  return API.put(UPDATE_PERSON_PATH(id), data)
}

export const searchPeople = (name: string) => {
  return API.get(SEARCH_PEOPLE_PATH, { name }).then((response) => response.map(cleanUpPerson));
}

export const mergePerson = (id: string, targetIds: string[]) => {
  return API.post(MERGE_PERSON_PATH(id), { ids: targetIds })
}

export const listSimilarFaces = (id: string, threshold: number) => {
  return API.get(SIMILAR_FACES_PATH(id), { threshold: threshold })
    .then((response) => response.map((person: any) => cleanUpPerson(person, true)));
}