import { IAsset } from "@/types/asset";
import { createContext, useContext } from "react";

export interface IPotentialAlbumConfig {
  startDate?: string;
  selectedIds: string[];
  assets: IAsset[];
  minAssets?: number;
}

export interface IPotentialAlbumContext extends IPotentialAlbumConfig {
  updateContext: (newConfig: Partial<IPotentialAlbumContext>) => void;
}
const PotentialAlbumContext = createContext<IPotentialAlbumContext>({
  startDate: undefined,
  selectedIds: [],
  assets: [],
  minAssets: 1,
  updateContext: () => { },
});

export default PotentialAlbumContext;

const usePotentialAlbumContext = () => {
  return useContext(PotentialAlbumContext) as IPotentialAlbumContext;
}
export {  usePotentialAlbumContext };

