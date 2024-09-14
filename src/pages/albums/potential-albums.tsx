import AlbumCreateDialog from "@/components/albums/AlbumCreateDialog";
import AlbumSelectorDialog from "@/components/albums/AlbumSelectorDialog";
import PotentialAlbumsAssets from "@/components/albums/potential-albums/PotentialAlbumsAssets";
import PotentialAlbumsDates from "@/components/albums/potential-albums/PotentialAlbumsDates";
import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import PotentialAlbumContext, {
  IPotentialAlbumConfig,
} from "@/contexts/PotentialAlbumContext";
import { addAssetToAlbum, createAlbum } from "@/handlers/api/album.handler";
import { IAlbum, IAlbumCreate } from "@/types/album";
import { useRouter } from "next/router";
import React from "react";

export default function PotentialAlbums() {
  const { toast } = useToast();
  const { id } = useCurrentUser();

  const { query } = useRouter();
  const { startDate } = query as { startDate: string };
  const [config, setConfig] = React.useState<IPotentialAlbumConfig>({
    startDate: startDate || undefined,
    selectedIds: [],
    assets: [],
  });

  const handleSelect = (album: IAlbum) => {
    return addAssetToAlbum(album.id, config.selectedIds)
      .then(() => {
        setConfig({ ...config, selectedIds: [] });
        setConfig({
          ...config,
          assets: config.assets.filter(
            (asset) => !config.selectedIds.includes(asset.id)
          ),
          selectedIds: [],
        });
      })
      .then(() => {
        toast({
          title: `Assets added to ${album.albumName}`,
          description: `${config.selectedIds.length} assets added to album`,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to add assets album",
          variant: "destructive",
        });
      });
  };

  const handleCreate = (formData: IAlbumCreate) => {
    return createAlbum({
      ...formData,
      assetIds: config.selectedIds,
      albumUsers: [{
        role: "editor",
        userId: id,
      }]
    })
  }
  
  return (
    <PageLayout className="!p-0 !mb-0">
      <Header
        leftComponent="Potential Albums"
        rightComponent={
          <>
            <Badge variant={"outline"}>
              {config.selectedIds.length} Selected
            </Badge>
            {config.selectedIds.length && config.selectedIds.length === config.assets.length ? (
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
            <AlbumSelectorDialog onSelected={handleSelect} />
            <AlbumCreateDialog onSubmit={handleCreate} assetIds={config.assets.map((a) => a.id)} />
          </>
        }
      />
      <PotentialAlbumContext.Provider
        value={{
          ...config,
          updateContext: (newConfig: Partial<IPotentialAlbumConfig>) =>
            setConfig({ ...config, ...newConfig }),
        }}
      >
        <div className="flex divide-y">
          <PotentialAlbumsDates />
          <PotentialAlbumsAssets />
        </div>
      </PotentialAlbumContext.Provider>
    </PageLayout>
  );
}
