import { GET_ME_PATH } from "@/config/routes";
import API from "@/lib/api";

export const getMe = async () => {
  return API.get(GET_ME_PATH);
}