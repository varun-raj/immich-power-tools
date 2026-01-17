import { useConfig } from "@/contexts/ConfigContext"
import { useUploadContext } from "@/contexts/UploadContext"
import { CheckCircle, XCircle, Loader2, Upload, Minus, Ban, ExternalLink, Circle, X, CloudUpload } from "lucide-react";
import { useState } from "react"

export type UploadState = "pending" | "uploading" | "success" | "error";

export function UploadDialog() {
  const { state } = useUploadContext();
  const [minimized, setMinimized] = useState(false);

  if (state.uploads.length === 0) return null;

  if (minimized)
    return <MinimizedUploadDialog onExpand={() => setMinimized(false)} />
  else
    return <ExpandedUploadDialog onMinimize={() => setMinimized(true)} />
}

function ExpandedUploadDialog({ onMinimize }: { onMinimize: () => void }) {
  return <div className="fixed bottom-6 end-16 w-80 rounded-xl border border-gray-200 dark:border-neutral-700 p-4 shadow text-gray-600 dark:text-gray-200 bg-neutral-50 dark:bg-neutral-900">
    <ExpandedUploadDialogHeader onMinimize={onMinimize} />
    <ExpandedUploadDialogList/>
  </div>
}

function ExpandedUploadDialogHeader({ onMinimize }: { onMinimize: () => void }) {
  const { state, dispatch } = useUploadContext();

  const uploaded = state.uploads.filter((u) => u.status === "success").length;
  const errors = state.uploads.filter((u) => u.status === "error").length;
  const remaining = state.uploads.length - uploaded - errors;
  const processed = uploaded + errors;

  return <div className="flex justify-between mb-4">
    <div className="flex flex-col gap-1 font-medium">
      <p className="text-sm">
        Remaining {remaining} – Processed {processed}/{state.uploads.length}
      </p>

      <p className="text-xs">
        Uploaded <span className="text-green-500">{uploaded}</span> – Errors{" "}
        <span className="text-red-400">{errors}</span>
      </p>
    </div>

    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-1">
        <button onClick={() => onMinimize()} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <button
      onClick={() => dispatch({type: "CLEAR_COMPLETED"})}
      title="Dismiss all errors"
      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <Ban className="h-4 w-4"/>
      </button>
    </div>
  </div>
}

function ExpandedUploadDialogList() {
  const { state, dispatch } = useUploadContext();
  const { exImmichUrl } = useConfig()

  return <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
    {state.uploads.map((item) => (
      <div
        key={item.asset.checksum}
        className="flex flex-col rounded-xl text-xs p-2 gap-1 border border-gray-300 dark:border-neutral-700 bg-primary/10"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <UploadStatusIcon status={item.status}/>
          </div>

          <span className="grow break-all">{item.asset.file.name}</span>

          {item.status === "success" && (
            <div className="flex items-center justify-between gap-1">
              <a
                href={`${exImmichUrl}/photos/${item.asset.id}`}
                target="_blank"
                className="opacity-70 hover:opacity-100"
              >
                <ExternalLink className="h-5 w-5"/>
              </a>
              <button
                onClick={() => dispatch({type:"REMOVE", payload: {checksum: item.asset.checksum}})}
                className="opacity-70 hover:opacity-100"
              >
                <X className="h-5 w-5"/>
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
}

function MinimizedUploadDialog({ onExpand }: { onExpand: () => void }) {
  const { state } = useUploadContext();

  const uploaded = state.uploads.filter((u) => u.status === "success").length;
  const errors = state.uploads.filter((u) => u.status === "error").length;
  const remaining = state.uploads.length - uploaded - errors;

  return (
    <div className="fixed bottom-6 end-16">
      <div className="rounded-full">
        <button type="button"
          onClick={onExpand}
          className="absolute -start-4 -top-4 flex h-10 w-10 place-content-center place-items-center rounded-full p-5 text-xs bg-blue-800 dark:bg-blue-300 text-gray-200">
          {remaining}
        </button>
        <button type="button"
          onClick={onExpand}
          className="flex h-16 w-16 place-content-center place-items-center rounded-full bg-gray-100 dark:bg-gray-700 p-5 text-sm text-blue-800 dark:text-blue-300 shadow-lg">
          <div className="animate-pulse">
            <CloudUpload/>
          </div>
        </button>
      </div>
    </div>
  )
}

function UploadStatusIcon({ status }: { status: UploadState }) {
  switch (status) {
    case "uploading": return <Loader2 className="h-5 w-5 animate-spin" />;
    case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "error": return <XCircle className="h-5 w-5 text-red-400" />;
    default: return <Circle className="h-5 w-5" />;
  }
}
