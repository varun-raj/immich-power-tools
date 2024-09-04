import { IUser } from "@/types/user";
import { createContext, useContext } from "react";

interface IUserContextType extends IUser {
  updateContext: (user: IUser | null) => void;
}

const UserContext = createContext<IUserContextType | null>(null);

export default UserContext;

export const useCurrentUser = () => {
  const context = useContext(UserContext) as IUserContextType;
  return context;
}