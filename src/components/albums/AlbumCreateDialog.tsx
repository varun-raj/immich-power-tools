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
import { IAlbum, IAlbumCreate } from "@/types/album";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

interface IProps {
  onCreated?: (album: IAlbum) => Promise<void>;
  onSubmit?: (data: IAlbumCreate) => Promise<any>;
  assetIds?: string[];
}
export default function AlbumCreateDialog({ onSubmit, assetIds }: IProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    albumName: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onSubmit) return;
    setLoading(true);
    onSubmit(formData)
      .then(() => {
        toast({
          title: "Album Created",
          description: "Album created successfully",
        });
        setFormData({ albumName: "" });
        setOpen(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "Failed to create album",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>Create Album</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Album</DialogTitle>
          <DialogDescription>
            Create and add photos to a new album
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
            <Button disabled={loading}>
              {loading ? "Creating Album" : "Create Album"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
