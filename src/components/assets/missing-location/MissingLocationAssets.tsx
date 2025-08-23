import { IAsset } from "@/types/asset";
import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarArrowUp,
  Hourglass,
} from "lucide-react";
import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";
import { listMissingLocationAssets } from "@/handlers/api/asset.handler";
import { useConfig } from "@/contexts/ConfigContext";
import AssetGrid from "@/components/shared/AssetGrid";

interface IProps {
  groupBy: "date" | "album";
}
export default function MissingLocationAssets({ groupBy }: IProps) {
  const { exImmichUrl } = useConfig();

  const {
    selectedIds,
    assets,
    updateContext,
    config
  } = usePhotoSelectionContext();
  const { startDate, albumId, sortOrder, sort } = config;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAssets = async () => {
    if (!startDate && !albumId) return;
    setLoading(true);
    updateContext({
      assets: [],
    });
    const filters = groupBy === "date" ? { startDate } : { albumId }
    return listMissingLocationAssets(filters)
      .then((fetchedAssets) => updateContext({ assets: fetchedAssets }))
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const processedAssets = useMemo(() => {
    let sortedAssets: IAsset[];
    try {
      if (sortOrder === "desc")
        sortedAssets = [...assets].sort((a, b) => new Date(b.dateTimeOriginal!).getTime() - new Date(a.dateTimeOriginal!).getTime())
      else
        sortedAssets = [...assets].sort((a, b) => new Date(a.dateTimeOriginal!).getTime() - new Date(b.dateTimeOriginal!).getTime());
    } catch (error) {
      console.error("Error sorting assets by date:", error);
      sortedAssets = [...assets];
    }

    return sortedAssets.map((asset) => ({
      ...asset,
      tags: [
        {
          title: "Immich Link",
          value: (
            <a href={exImmichUrl + "/photos/" + asset.id} target="_blank" rel="noopener noreferrer">
              Open in Immich
            </a>
          ),
        },
      ],
    }));
  }, [assets, sortOrder, exImmichUrl]);

  const handleSelectionChange = (ids: string[]) => {
    updateContext({ selectedIds: ids });
  };

  useEffect(() => {
    if (startDate || albumId) fetchAssets();
  }, [startDate, albumId]);

  if (loading)
    return (
      <div className="flex flex-col gap-2 h-full justify-center items-center w-full">
        <Hourglass />
        <p className="text-lg">Loading...</p>
      </div>
    );

  if (!startDate && !albumId)
    return (
      <div className="flex flex-col gap-2 h-full justify-center items-center w-full">
        <CalendarArrowUp />
        <p className="text-lg">Please select a date or album</p>
        <p className="text-sm">
          When you select an item from the left, you will see all the orphan
          assets associated with it.
        </p>
      </div>
    );

  return (
    <div className="w-full overflow-y-auto max-h-[calc(100vh-60px)]">
      <AssetGrid
        assets={processedAssets}
        isInternal={true}
        selectable={true}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
