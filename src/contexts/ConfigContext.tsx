import { createContext, useContext } from "react";

export interface ConfigContextType {
  immichURL: string;
  exImmichUrl: string;
  version?: string;
  geminiEnabled: boolean;
  googleMapsApiKey: string;
}

const ConfigContext = createContext<ConfigContextType>({
  immichURL: "",
  exImmichUrl: "",
  version: "",
  geminiEnabled: false,
  googleMapsApiKey: "",
});

export default ConfigContext;

export const useConfig = () => {
  const context = useContext(ConfigContext) as ConfigContextType;
  return context;
}