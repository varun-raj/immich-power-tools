import { createContext, useContext } from "react";

interface ConfigContextType {
  immichURL: string;
  exImmichUrl: string;
  version?: string;
}

const ConfigContext = createContext<ConfigContextType>({
  immichURL: "",
  exImmichUrl: "",
  version: "",
});

export default ConfigContext;

export const useConfig = () => {
  const context = useContext(ConfigContext) as ConfigContextType;
  return context;
}