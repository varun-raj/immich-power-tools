import { createContext, useContext } from "react";

interface ConfigContextType {
  immichURL: string;
}

const ConfigContext = createContext<ConfigContextType>({
  immichURL: "",
});

export default ConfigContext;

export const useConfig = () => {
  const context = useContext(ConfigContext) as ConfigContextType;
  return context;
}