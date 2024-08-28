import { createContext, useContext } from "react";

interface ConfigContextType {
  immichURL: string;
  exImmichUrl: string;
}

const ConfigContext = createContext<ConfigContextType>({
  immichURL: "",
  exImmichUrl: "",
});

export default ConfigContext;

export const useConfig = () => {
  const context = useContext(ConfigContext) as ConfigContextType;
  return context;
}