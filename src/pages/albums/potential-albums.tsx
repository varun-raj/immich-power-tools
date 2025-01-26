import AlbumSelectorDialog from "@/components/albums/AlbumSelectorDialog";
import PotentialAlbumsAssets from "@/components/albums/potential-albums/PotentialAlbumsAssets";
import PotentialAlbumsDates from "@/components/albums/potential-albums/PotentialAlbumsDates";
import AssetOffsetDialog from "@/components/assets/assets-options/AssetOffsetDialog";
import PageLayout from "@/components/layouts/PageLayout";
import FloatingBar from "@/components/shared/FloatingBar";
import Header from "@/components/shared/Header";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import PotentialAlbumContext, {
  IPotentialAlbumConfig,
} from "@/contexts/PotentialAlbumContext";
import { addAssetToAlbum, createAlbum } from "@/handlers/api/album.handler";
import { deleteAssets } from "@/handlers/api/asset.handler";
import { IAlbum, IAlbumCreate } from "@/types/album";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

export default function PotentialAlbums() {
  const { toast } = useToast();
  const { id } = useCurrentUser();

  const { query } = useRouter();
  const { startDate } = query as { startDate: string };
  const [config, setConfig] = React.useState<IPotentialAlbumConfig>({
    startDate: startDate || undefined,
    selectedIds: [],
    assets: [],
    minAssets: 1,
  });

  const selectedAssets = useMemo(() => config.assets.filter((a) => config.selectedIds.includes(a.id)), [config.assets, config.selectedIds]);

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
    }).then(() => {
      toast({
        title: "Album created",
        description: "Album created successfully",
      });
      setConfig({ ...config, selectedIds: [], assets: config.assets.filter(a => !config.selectedIds.includes(a.id)) });
    })
  }

  const handleDelete = () => {
    return deleteAssets(config.selectedIds)
      .then(() => {
        setConfig({ ...config, selectedIds: [], assets: config.assets.filter(a => !config.selectedIds.includes(a.id)) });
      })
      .then(() => {
        toast({
          title: "Assets deleted",
          description: "Assets deleted successfully",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete assets",
          variant: "destructive",
        });
      });
  }

  const handleOffsetComplete = () => {
    setConfig({
      ...config,
      selectedIds: [],
    });
  }

  return (
    <PageLayout className="!p-0 !mb-0 relative">
      <Header
        leftComponent="Potential Albums"
        rightComponent={(
          <div className="flex items-center gap-2">
            <Input
              placeholder="Minimum Assets Count"
              defaultValue={config.minAssets}
              onChange={(e) => {
                if (e.target.value) {
                  setConfig({ ...config, minAssets: parseInt(e.target.value) });
                }
              }}
            />
          </div>
        )}
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
        {selectedAssets.length &&
          <FloatingBar>
            <div className="flex items-center gap-2 justify-between w-full">
              <p className="text-sm text-muted-foreground">
                {config.selectedIds.length} Selected
              </p>
              <div className="flex items-center gap-2">
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
                <AlbumSelectorDialog onSelected={handleSelect} onSubmit={handleCreate} />
                <AssetOffsetDialog assets={selectedAssets} onComplete={handleOffsetComplete} />
                <div className="h-[10px] w-[1px] bg-zinc-500 dark:bg-zinc-600"></div>

                <AlertDialog
                  title="Delete the selected assets?"
                  description="This action will delete the selected assets and cannot be undone."
                  onConfirm={handleDelete}
                  disabled={config.selectedIds.length === 0}
                >
                  <Button variant={"destructive"} size={"sm"} disabled={config.selectedIds.length === 0}>
                    Delete
                  </Button>
                </AlertDialog>
              </div>
            </div>
          </FloatingBar>
        }
      </PotentialAlbumContext.Provider>
    </PageLayout>
  );
}
