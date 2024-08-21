import { createContext, useContext } from "react";

export interface ConfigContextType {
  immichURL: string;
  googleClientId: string;
  baseURL: string;
}

const ConfigContext = createContext<ConfigContextType>({
  immichURL: "",
  googleClientId: "",
  baseURL: "",
});

export default ConfigContext;

export const useConfig = () => {
  const context = useContext(ConfigContext) as ConfigContextType;
  return context;
}