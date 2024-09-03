import { GET_ME_PATH, LOGIN_PATH } from "@/config/routes";
import API from "@/lib/api";

export const getMe = async () => {
  return API.get(GET_ME_PATH);
}

export const loginUser = async (email: string, password: string) => {
  return API.post(LOGIN_PATH, { email, password });
}