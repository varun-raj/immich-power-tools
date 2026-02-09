import { UploadItem, useUploadContext } from "@/contexts/UploadContext"
import { uploadAsset } from "@/handlers/api/asset.handler"
import { IDeviceAsset } from "@/types/asset"
import { useEffect, useRef } from "react"

export interface IUploadManagerProps {
  onUploadSuccess: (asset: IDeviceAsset) => void
}

/**
 * Watch upload context and automatically starts uploading files added to the queue
 */
export function useUploadManager({ onUploadSuccess }: IUploadManagerProps) {
  const { state, dispatch } = useUploadContext();
  const isUploading = useRef(false); //Prevent concurrent uploads

  useEffect(() => {
    if (isUploading.current) return;

    const next = state.uploads.find(u => u.status === "pending");
    if (!next) return;

    isUploading.current = true;
    startUpload(next);
  }, [state.uploads]);

  const startUpload = async (item: UploadItem) => {
    dispatch({
      type: "UPDATE_STATUS",
      payload: { checksum: item.asset.checksum, status: "uploading" }
    });

    try {
      const { id } = await uploadAsset(item.asset.file);

      dispatch({
        type: "UPDATE_STATUS",
        payload: { checksum: item.asset.checksum, status: "success" }
      });

      onUploadSuccess({ ...item.asset, id });

    } catch (err) {
      dispatch({
        type: "UPDATE_STATUS",
        payload: { checksum: item.asset.checksum, status: "error" }
      });

    } finally {
      isUploading.current = false;
    }
  };
}
