import { LIST_PEOPLE_PATH, MERGE_PERSON_PATH, SEARCH_PEOPLE_PATH, UPDATE_PERSON_PATH } from "@/config/routes"
import { cleanUpPerson } from "@/helpers/person.helper";
import API from "@/lib/api"
import { IPeopleListResponse, IPerson } from "@/types/person"

export const listPeople = (): Promise<IPeopleListResponse> => {
  return API.get(LIST_PEOPLE_PATH).then((response) => {
    return {
      ...response,
      people: response.people.map(cleanUpPerson),
    }
  });
}

export const updatePerson = (id: string, data: Partial<{
  name: string;
  birthDate: string;
  isHidden: boolean;
}>) => {
  return API.put(UPDATE_PERSON_PATH(id), data)
}

export const searchPeople = (name: string) => {
  return API.get(SEARCH_PEOPLE_PATH, { name }).then((response) => response.map(cleanUpPerson));
}

export const mergePerson = (id: string, targetId: string) => {
  return API.post(MERGE_PERSON_PATH(id), { ids: [ targetId ] })
}