import React, { useEffect, useMemo, useState } from "react";
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
import { IAlbum } from "@/types/album";
import { Input } from "../ui/input";

interface IProps {
  onSelected: (album: IAlbum) => Promise<void>;
}
export default function AlbumSelectorDialog({ onSelected }: IProps) {
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    if (open && !albums.length) fetchData();
  }, [open]);

  const renderContent = () => {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>Select Album</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Albums</DialogTitle>
          <DialogDescription>
            Select the albums you want to add the selected assets to
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
