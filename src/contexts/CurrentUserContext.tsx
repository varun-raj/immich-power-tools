import { IUser } from "@/types/user";
import { createContext, useContext } from "react";

interface IUserContextType extends IUser {}

const UserContext = createContext<IUserContextType | null>(null);

export default UserContext;

export const useCurrentUser = () => {
  const context = useContext(UserContext) as IUserContextType;
  return context;
}