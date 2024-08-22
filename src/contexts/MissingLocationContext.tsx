import { IAsset } from "@/types/asset";
import { createContext, useContext } from "react";

export interface IMissingLocationConfig {
  startDate?: string;
  selectedIds: string[];
  assets: IAsset[];
}

export interface MissingLocationContext extends IMissingLocationConfig {
  updateContext: (newConfig: Partial<MissingLocationContext>) => void;
}
const MissingLocationContext = createContext<MissingLocationContext>({
  startDate: undefined,
  selectedIds: [],
  assets: [],
  updateContext: () => { },
});

export default MissingLocationContext;

const useMissingLocationContext = () => {
  return useContext(MissingLocationContext) as MissingLocationContext;
}
export {  useMissingLocationContext };

