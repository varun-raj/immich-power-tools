import { createContext, useContext } from "react";

export interface IImportWorkflowConfig {
  authenticated: boolean
  googleAlbumId: string | null
  googlePhotoIds: string[] | null
  immichAlbumId: string | null
}

interface IGAImportContext extends IImportWorkflowConfig {
  updateContext: (newConfig: Partial<IImportWorkflowConfig>) => void
}
const GAImportContext = createContext<IGAImportContext>({
  authenticated: false,
  googleAlbumId: null,
  googlePhotoIds: null,
  immichAlbumId: null,
  updateContext: () => {}
});

export default GAImportContext;

export const useGAImportConfig = () => {
  const context = useContext(GAImportContext) as IImportWorkflowConfig;
  return context;
}