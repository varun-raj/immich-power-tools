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
import FloatingBar from "@/components/shared/FloatingBar";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function MissingLocations() {
  const { query, push } = useRouter();
  const { startDate, groupBy = "date" } = query as { startDate: string, groupBy: string };
  const [config, setConfig] = React.useState<IMissingLocationConfig>({
    startDate: startDate || undefined,
    selectedIds: [],
    assets: [],
  });

  const selectedAssets = useMemo(() => config.assets.filter((a) => config.selectedIds.includes(a.id)), [config.assets, config.selectedIds]);

  const handleSubmit = (place: IPlace) => {
    return updateAssets({
      ids: config.selectedIds,
      latitude: place.latitude,
      longitude: place.longitude,
    }).then(() => {
      setConfig({
        ...config,
        selectedIds: [],
      });
    })
  };

  return (
    <PageLayout className="!p-0 !mb-0 relative">
      <Header
        leftComponent="Missing Location"
        rightComponent={
          <div className="flex items-center gap-2">
            <Select value={groupBy} onValueChange={(value) => {
              push({
                pathname: "/assets/missing-locations",
                query: {
                  ...query,
                  groupBy: value,
                  startDate: undefined,
                  albumId: undefined,
                },
              });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="album">Album</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            <AssetsOptions assets={selectedAssets} onAdd={() => { }} />
          </div>
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
          <MissingLocationDates groupBy={groupBy as "date" | "album"} />
          <MissingLocationAssets groupBy={groupBy as "date" | "album"} />
        </div>
        <FloatingBar>
          <div className="flex items-center gap-2 justify-between w-full">
            <p className="text-sm text-muted-foreground">
              {config.selectedIds.length} Selected
            </p>
            <div className="flex items-center gap-2">
              {config.selectedIds.length === config.assets.length ? (
                <Button
                  variant={"outline"}
                  size={"sm"}
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
                  size={"sm"}
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
            </div>
          </div>
        </FloatingBar>
      </MissingLocationContext.Provider>
    </PageLayout>
  );
}
