import { PERSON_THUBNAIL_PATH } from "@/config/routes"
import { IPerson } from "@/types/person"

export const cleanUpPerson = (person: IPerson): IPerson => {
  return {
    ...person,
    thumbnailPath: PERSON_THUBNAIL_PATH(person.id),
    birthDate: person.birthDate ? new Date(person.birthDate) : null,
    updatedAt: new Date(person.updatedAt),
  }
}