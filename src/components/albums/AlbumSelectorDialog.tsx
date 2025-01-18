import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { listAlbums } from "@/handlers/api/album.handler";
import { IAlbum, IAlbumCreate } from "@/types/album";
import { Input } from "../ui/input";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import toast from "react-hot-toast";
import { Label } from "../ui/label";

interface IProps {
  onSelected: (album: IAlbum) => Promise<void>;
  onCreated?: (album: IAlbum) => Promise<void>;
  onSubmit?: (data: IAlbumCreate) => Promise<any>;
}
export default function AlbumSelectorDialog({ onSelected, onCreated, onSubmit }: IProps) {
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { selectedIds, assets } = usePotentialAlbumContext();
  const [formData, setFormData] = useState({
    albumName: "",
  });

  const fetchData = () => {
    return listAlbums()
      .then(setAlbums)
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) =>
      album.albumName.toLowerCase().includes(search.toLowerCase())
    );
  }, [albums, search]);

  const handleSelect = (album: IAlbum) => () => {
    onSelected(album).then(() => {
      setOpen(false);
      setSearch("");
    });
  }


  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (!onSubmit) return;
    setLoading(true);
    onSubmit(formData)
      .then(() => {
        toast.success("Album created successfully");
        setFormData({ albumName: "" });
        setOpen(false);
      })
      .catch((e) => {
        toast.error("Failed to create album");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onSubmit, formData]);


  useEffect(() => {
    if (open && !albums.length) fetchData();
  }, [open]);

  const renderContent = useCallback(() => {
    if (loading) return <p>Loading...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;
    return (
      <div>
        <Input
          placeholder="Search Albums"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="max-h-[500px] min-h-[500px] overflow-y-auto flex flex-col gap-2 py-2">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              role="button"
              onClick={handleSelect(album)}
              className={
                "flex gap-1 flex-col p-2 py-1 rounded-lg hover:dark:bg-zinc-800 hover:bg-zinc-100 px-4"
              }
            >
              <p className="font-mono text-sm">{album.albumName}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }, [albums, filteredAlbums, handleSelect, loading, errorMessage]);

  const renderCreateContent = useCallback(() => { 
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[500px] min-h-[500px]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Create a new album and add the selected assets to it
        </p>
          <div className="flex flex-col gap-2">
            <Label>Album Name</Label>
            <Input
              placeholder="Album Name"
              onChange={(e) => {
                setFormData({ ...formData, albumName: e.target.value });
              }}
            />
          </div>
          <div className="self-end">
            <Button disabled={loading} type="submit">
              {loading ? "Creating Album" : "Create Album"}
            </Button>
          </div>
        </form>
    )
  }, [loading, formData, handleSubmit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} disabled={!selectedIds.length}>Add to Album</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Albums</DialogTitle>
          <DialogDescription>
            Select the albums you want to add the selected assets to
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="albums" className="w-full">   
          <TabsList className="w-full"> 
            <TabsTrigger className="w-full" value="albums">Albums</TabsTrigger>
            <TabsTrigger className="w-full" value="create">Create</TabsTrigger>
          </TabsList>
          <TabsContent value="albums">
            {renderContent()}
          </TabsContent>
          <TabsContent value="create">
            {renderCreateContent()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
