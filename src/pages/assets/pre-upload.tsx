import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import { Dropzone } from "@/components/ui/dropzone";
import { DevicePhotoSelectionProvider, useDevicePhotoSelectionContext } from "@/contexts/DevicePhotoSelectionContext"
import PreUploadAssetGrid from "@/components/assets/pre-upload/PreUploadAssetGrid"
import { IDeviceAsset } from "@/types/asset"
import FloatingBar from "@/components/shared/FloatingBar"
import { Button } from "@/components/ui/button"
import { SortAsc, SortDesc } from "lucide-react"
import { AddFileButton } from "@/components/ui/add-files-button"
import { UploadDialog } from "@/components/assets/pre-upload/upload-dialog"
import { useUploadManager } from "@/hooks/upload-manager"
import { UploadProvider, useUploadContext } from "@/contexts/UploadContext"
import { getDeviceAssetData } from "@/helpers/file.helper"

const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/tiff",
  "image/gif",

  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
];

export default function PreUploadPage() {
  return (
    <UploadProvider>
    <DevicePhotoSelectionProvider>
    <PreUploadPageContent />
    </DevicePhotoSelectionProvider>
    </UploadProvider>
  );
}

function PreUploadPageContent() {
  const { state: selectionState, dispatch: selectionDispatch } = useDevicePhotoSelectionContext();
  const { dispatch: uploadDispatch } = useUploadContext();

  const [ lastAdded, setLastAdded ] = useState<IDeviceAsset[]>([]);

  useUploadManager({
    onUploadSuccess: (asset: IDeviceAsset) => selectionDispatch({type: "UPDATE_ASSET", payload: asset})
  });

  /** List of checksum of files that can be uploaded */
  const validChecksum = useMemo(() => {
    return selectionState.assets.filter(f => f.id === null).map(f => f.checksum);
  }, [selectionState.assets]);

  /** List of checksum of selected files that can be uploaded */
  const validSelectedChecksum = useMemo(() => {
    return selectionState.assets.filter(f => isSelected(f) && f.id === null).map(f => f.checksum);
  }, [selectionState.assets, selectionState.selectedChecksums]);

  const isSelected = (asset: IDeviceAsset) => selectionState.selectedChecksums.includes(asset.checksum)

  // On dismount, revoke all object urls
  useEffect(() => {
    return () => {
      selectionState.assets.forEach(a => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
  }, []);

const handleFilesAdded = async (newFiles: File[]) => {
  for (const file of newFiles) {
    const asset = await getDeviceAssetData(file);
    selectionDispatch({ type: "ADD_ASSETS", payload: [asset] });

    // Track last added for rejection cleanup
    setLastAdded(prev => [...prev, asset]);

    // Yield to UI thread to prevents blocking
    await new Promise(r => setTimeout(r, 0));
  }
};

  /** The reducer may reject files, revoke their ObjectURL **/
  useEffect(() => {
    if (lastAdded.length === 0)
      return;
    const rejected = lastAdded.filter( added => !selectionState.assets.some(asset => asset.checksum === added.checksum) );
    rejected.forEach(r => URL.revokeObjectURL(r.previewUrl));
    setLastAdded([]); },
    [selectionState.assets]
  );

  const handleUploadSelected = async () => {
    const toUpload = selectionState.assets.filter((f) => isSelected(f) && f.id === null);
    if (toUpload.length === 0) return;

    uploadDispatch({type:"ADD_ASSETS", payload: toUpload});
    selectionDispatch({type: "SET_SELECTED", payload: []})
  };

  return (
    <PageLayout className="relative !mb-0">
      <PreUploadPageHeader handleFilesAdded={handleFilesAdded}/>

      <Dropzone showOnDragOnly={selectionState.assets.length > 0} supportedTypes={SUPPORTED_TYPES} onFilesDropped={handleFilesAdded}>
      </Dropzone>

      <div className="w-full overflow-y-auto max-h-[calc(100vh-60px)]">
        <PreUploadAssetGrid/>
      </div>

      {validSelectedChecksum.length > 0 &&
        <PreUploadPageFloatingBar validChecksum={validChecksum} validSelectedChecksum={validSelectedChecksum} handleUploadSelected={handleUploadSelected}/>
      }
      <UploadDialog/>
    </PageLayout>
  );
}

function PreUploadPageHeader(props: {
  handleFilesAdded: (newFiles: File[]) => void
}) {
  const { dispatch: selectionDispatch, state: selectionState } = useDevicePhotoSelectionContext();

  const { handleFilesAdded } = props;

  const handleSortChange = (e: { sortOrder: "asc" | "desc" }) => {
    selectionDispatch({ type: "SET_SORT_ORDER", payload: e.sortOrder });
  }

  return <Header leftComponent="Pre-Upload" rightComponent={
    <div className="flex items-center gap-2">
      <div>
        <Button variant="default" size="sm" onClick={() => handleSortChange({ sortOrder: selectionState.config.sortOrder === "asc" ? "desc" : "asc" })}>
          {selectionState.config.sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
        </Button>
      </div>
      <div>
        <AddFileButton variant="default" size="sm" supportedTypes={SUPPORTED_TYPES} multiple={true} onFilesSelected={handleFilesAdded} />
      </div>
    </div>
  } />
}

function PreUploadPageFloatingBar(props: {
  validChecksum: string[],
  validSelectedChecksum: string[]
  handleUploadSelected: () => void
}) {
  const { dispatch: selectionDispatch } = useDevicePhotoSelectionContext();

  const { handleUploadSelected, validChecksum, validSelectedChecksum } = props;

  return <FloatingBar>
    <div className="flex items-center gap-2 justify-between w-full">
      <p className="text-sm text-muted-foreground">
        {validSelectedChecksum.length} Selected
      </p>
      <div className="flex items-center gap-2">

        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() =>
            selectionDispatch({type:"SET_SELECTED", payload: []})
          }
        >
          Unselect all
        </Button>

        {validSelectedChecksum.length < validChecksum.length && <Button
          variant={"outline"}
          size={"sm"}
          onClick={() =>
            selectionDispatch({type:"SET_SELECTED", payload: validChecksum})
          }
          >
            Select all
          </Button>
        }

        <Button size={"sm"} onClick={handleUploadSelected}>
          Upload
        </Button>
      </div>
    </div>
  </FloatingBar>
}
