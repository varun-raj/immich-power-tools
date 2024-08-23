import { PERSON_THUBNAIL_PATH } from "@/config/routes"
import { IPerson } from "@/types/person"
import { parseDate } from "./date.helper"

interface IAPIPerson extends Omit<IPerson, 'birthDate' | 'updatedAt'> {
  updatedAt: string;
  birthDate: string | null;
}

export const cleanUpPerson = (person: IAPIPerson, skipMock?: boolean): IPerson => {
  return {
    ...person,
    thumbnailPath: PERSON_THUBNAIL_PATH(person.id),
    birthDate: person.birthDate ? new Date(person.birthDate) : null,
    updatedAt: new Date(person.updatedAt),
  }
}