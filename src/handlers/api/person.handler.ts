import API from "@/lib/api";
import { GET_PERSON_INFO } from "@/config/routes";

export const getPersonInfo = async (personId: string) => {
  return API.get(GET_PERSON_INFO(personId));
} 