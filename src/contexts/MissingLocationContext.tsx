import { IMissingLocationDatesResponse } from "@/handlers/api/asset.handler";
import { IAsset } from "@/types/asset";
import { createContext, useContext } from "react";

export interface IMissingLocationConfig {
  startDate?: string;
  albumId?: string;
  selectedIds: string[];
  assets: IAsset[];
  sort: "fileOriginalDate";
  sortOrder: "asc"|"desc";
  dates: IMissingLocationDatesResponse[];
}

export interface MissingLocationContext extends IMissingLocationConfig {
  updateContext: (newConfig: Partial<MissingLocationContext>) => void;
}
const MissingLocationContext = createContext<MissingLocationContext>({
  startDate: undefined,
  albumId: undefined,
  dates: [],
  selectedIds: [],
  assets: [],
  updateContext: () => { },
  sort:"fileOriginalDate",
  sortOrder: "asc"
});

export default MissingLocationContext;

const useMissingLocationContext = () => {
  return useContext(MissingLocationContext) as MissingLocationContext;
}
export {  useMissingLocationContext };

