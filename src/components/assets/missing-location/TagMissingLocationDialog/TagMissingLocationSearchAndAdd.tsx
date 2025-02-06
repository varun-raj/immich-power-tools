import ErrorBlock from "@/components/shared/ErrorBlock";
import { Button } from "@/components/ui/button";

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

interface ITagMissingLocationSearchAndAddProps {
  onSubmit: (place: IPlace) => Promise<any>;
  onOpenChange: (open: boolean) => void;
}
export default function TagMissingLocationSearchAndAdd(
  {
    onSubmit,
    onOpenChange
  }: ITagMissingLocationSearchAndAddProps
) {
  const { toast } = useToast();
  const [searchedPlaces, setSearchedPlaces] = useState<IPlace[] | null>(null);
  const searchTimer = useRef<NodeJS.Timeout>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);

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
        onOpenChange(false);
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
    <div className="flex flex-col gap-4 py-4 px-2">
      <div className="flex flex-col gap-2">
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
                  "hover:bg-zinc-200 dark:hover:bg-zinc-800 flex justify-between items-center px-2 py-1 rounded-lg cursor-pointer",
                  {
                    "bg-zinc-900 dark:bg-zinc-200":
                      selectedPlace && selectedPlace.name === place.name,
                  }
                )}
              >
                <div>
                  <p>{place.name}</p>
                  <span className="text-xs text-gray-600 dark:text-gray-200">
                    {place.latitude}, {place.longitude}
                  </span>
                </div>
                {selectedPlace && selectedPlace.name === place.name && (
                  <Check className="text-green-500 dark:text-green-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="self-end">
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={!selectedPlace || submitting}
        >
          Tag Location
        </Button>
      </div>
    </div>
  )
}
