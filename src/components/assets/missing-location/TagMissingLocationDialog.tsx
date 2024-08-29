import ErrorBlock from "@/components/shared/ErrorBlock";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";
import { searchPlaces } from "@/handlers/api/common.handler";
import { cn } from "@/lib/utils";
import { IPlace } from "@/types/common";
import clsx from "clsx";
import { Check } from "lucide-react";
import React, { useRef, useState } from "react";

interface ITagMissingLocationDialogProps {
  onSubmit: (place: IPlace) => Promise<any>;
}
export default function TagMissingLocationDialog({
  onSubmit,
}: ITagMissingLocationDialogProps) {
  const [searchedPlaces, setSearchedPlaces] = useState<IPlace[] | null>(null);
  const searchTimer = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (value: string) => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      if (!value || !value.trim().length) {
        setSearchedPlaces(null);
        return;
      }
      setSelectedPlace(null);
      setSearchedPlaces([]);
      setLoading(true);
      if (!value) {
        setSearchedPlaces([]);
        setLoading(false);
        return;
      }

      return searchPlaces(value)
        .then(setSearchedPlaces)
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };

  const handleSelect = (place: IPlace) => {
    if (selectedPlace && selectedPlace.name === place.name) {
      setSelectedPlace(null);
    } else {
      setSelectedPlace(place);
    }
  };

  const handleSubmit = () => {
    if (!selectedPlace) {
      return;
    }

    setSubmitting(true);
    onSubmit(selectedPlace)
      .then(() => {
        toast({
          title: "Location updated",
          description: "Location updated successfully",
        });
      })
      .then(() => {
        setOpen(false);
        setSelectedPlace(null);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Error updating location",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tag Missing Location</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tag Missing Location</DialogTitle>
          <DialogDescription>
            Tagging a location will add the location to the selected assets.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Search Location</Label>
            <Input
              placeholder="Search location"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </div>
          <div>
            {loading && <Loader />}
            {!loading && searchedPlaces && searchedPlaces.length === 0 && (
              <ErrorBlock description="No results found" />
            )}
            {!loading && searchedPlaces && searchedPlaces.length > 0 && (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                {searchedPlaces.map((place) => (
                  <div
                    key={place.name}
                    onClick={() => handleSelect(place)}
                    className={cn(
                      "hover:bg-zinc-900 flex justify-between items-center px-2 py-1 rounded-lg cursor-pointer",
                      {
                        "bg-zinc-900":
                          selectedPlace && selectedPlace.name === place.name,
                      }
                    )}
                  >
                    <div>
                      <p>{place.name}</p>
                      <span className="text-xs text-gray-600">
                        {place.latitude}, {place.longitude}
                      </span>
                    </div>
                    {selectedPlace && selectedPlace.name === place.name && (
                      <Check className="text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="self-end">
            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={!selectedPlace || submitting}
            >
              Add New Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
