import { IAsset } from "@/types/asset";
import { createContext, useContext } from "react";

export interface IMissingLocationConfig {
  startDate?: string;
  albumId?: string;
  selectedIds: string[];
  assets: IAsset[];
  sort: "fileOriginalDate";
  sortOrder: "asc"|"desc";
}

export interface MissingLocationContext extends IMissingLocationConfig {
  updateContext: (newConfig: Partial<MissingLocationContext>) => void;
}
const MissingLocationContext = createContext<MissingLocationContext>({
  startDate: undefined,
  albumId: undefined,
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

