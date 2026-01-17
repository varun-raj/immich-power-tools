import React from "react";

export type AssetStatus = "UNKNOWN" | "EXIST" | "MISSING" | "SELECTED" | "UPLOADING";

interface Props {
  state: AssetStatus;
}

/**
* Show a block of color below images to represent their state
*/
export default function PreUploadAssetState({ state }: Props) {
  const base = "min-h-[6px] w-full";

  const styles: Record<AssetStatus, string> = {
    UNKNOWN: "bg-gray-400 animate-pulse",
    EXIST: "bg-green-500",
    MISSING: "bg-red-500",
    SELECTED: "bg-purple-500",
    UPLOADING: "bg-blue-400 animate-pulse",
  };

  return <div className={`${base} ${styles[state]}`} />;
}
