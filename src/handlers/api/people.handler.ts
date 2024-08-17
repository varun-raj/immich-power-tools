import { LIST_PEOPLE_PATH, UPDATE_PERSON_PATH } from "@/config/routes"
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