import { IMissingLocationDatesResponse } from "@/handlers/api/asset.handler";
import { IAsset } from "@/types/asset";
import { createContext, useContext } from "react";

export interface IMissingLocationConfig {
  startDate?: string;
  selectedIds: string[];
  assets: IAsset[];
  dates: IMissingLocationDatesResponse[];
}

export interface MissingLocationContext extends IMissingLocationConfig {
  updateContext: (newConfig: Partial<MissingLocationContext>) => void;
}
const MissingLocationContext = createContext<MissingLocationContext>({
  startDate: undefined,
  dates: [],
  selectedIds: [],
  assets: [],
  updateContext: () => { },
});

export default MissingLocationContext;

const useMissingLocationContext = () => {
  return useContext(MissingLocationContext) as MissingLocationContext;
}
export {  useMissingLocationContext };

