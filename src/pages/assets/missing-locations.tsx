import AssetsOptions from "@/components/assets/assets-options/AssetsOptions";
import MissingLocationAssets from "@/components/assets/missing-location/MissingLocationAssets";
import MissingLocationDates from "@/components/assets/missing-location/MissingLocationDates";
import TagMissingLocationDialog from "@/components/assets/missing-location/TagMissingLocationDialog/TagMissingLocationDialog";
import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MissingLocationContext, {
  IMissingLocationConfig,
} from "@/contexts/MissingLocationContext";
import { updateAssets } from "@/handlers/api/asset.handler";

import { IPlace } from "@/types/common";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

export default function MissingLocations() {
  const { toast } = useToast();

  const { query } = useRouter();
  const { startDate } = query as { startDate: string };
  const [config, setConfig] = React.useState<IMissingLocationConfig>({
    startDate: startDate || undefined,
    selectedIds: [],
    assets: [],
  });

  const selectedAssets = useMemo(() => config.assets.filter((a) => config.selectedIds.includes(a.id)), [config.assets, config.selectedIds]) ;

  const handleSubmit = async (place: IPlace) => {
    await updateAssets({
      ids: config.selectedIds,
      latitude: place.latitude,
      longitude: place.longitude,
    });

    const newAssets = config.assets.filter(asset => !config.selectedIds.includes(asset.id));

    setConfig({
      ...config,
      selectedIds: [],
      assets: newAssets
    });
  };

  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent="Missing Location"
        rightComponent={
          <>
            <Badge variant={"outline"}>
              {config.selectedIds.length} Selected
            </Badge>
            {config.selectedIds.length === config.assets.length ? (
              <Button
                variant={"outline"}
                onClick={() =>
                  setConfig({
                    ...config,
                    selectedIds: [],
                  })
                }
              >
                Unselect all
              </Button>
            ) : (
              <Button
                variant={"outline"}
                onClick={() =>
                  setConfig({
                    ...config,
                    selectedIds: config.assets.map((a) => a.id),
                  })
                }
              >
                Select all
              </Button>
            )}
            <TagMissingLocationDialog onSubmit={handleSubmit} />
            <AssetsOptions assets={selectedAssets} onAdd={() => { }} />
          </>
        }
      />
      <MissingLocationContext.Provider
        value={{
          ...config,
          updateContext: (newConfig: Partial<IMissingLocationConfig>) =>
            setConfig({ ...config, ...newConfig }),
        }}
      >
        <div className="flex divide-y">
          <MissingLocationDates />
          <MissingLocationAssets />
        </div>
      </MissingLocationContext.Provider>
    </PageLayout>
  );
}
