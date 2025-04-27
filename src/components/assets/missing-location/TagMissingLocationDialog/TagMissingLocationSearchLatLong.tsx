
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { IPlace } from "@/types/common";
import React, { useEffect, useMemo, useState } from "react";

interface TagMissingLocationSearchLatLongProps {
  onSubmit: (place: IPlace) => Promise<any>;
  onOpenChange: (open: boolean) => void;
  location: IPlace;
  onLocationChange: (place: IPlace) => void;
}

export default function TagMissingLocationSearchLatLong(
  {
    onSubmit,
    onOpenChange,
    location,
    onLocationChange
  }: TagMissingLocationSearchLatLongProps
) {
  const { toast } = useToast();

  const [latLong, setLatLong] = useState<string>("");

  const [formData, setFormData] = useState<IPlace>({
    latitude: location.latitude,
    longitude: location.longitude,
    name: location.name,
  });
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
      return false;
    }
    if (formData.latitude === 0 || formData.longitude === 0) {
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    setSubmitting(true);
    onSubmit(formData)
      .then(() => {
        toast({
          title: "Location updated",
          description: "Location updated successfully",
        });
      })
      .then(() => {
        onOpenChange(false);
        setFormData({
          latitude: 0,
          longitude: 0,
          name: "",
        });
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


  const handleBlur = () => {
    const place :IPlace = {
      name: formData.name,
      latitude: parseFloat(formData.latitude as unknown as string),
      longitude: parseFloat(formData.longitude as unknown as string)
    };

    onLocationChange(place);
  }

  useEffect(() => {
    if (latLong) {
      const [latitude, longitude] = latLong.split(",");
      setFormData({
        ...formData,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }
  }, [latLong]);

  return (
    <div className="flex flex-col gap-4 py-4 px-2">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <Label>Latitude, Longitude</Label>
          <span className="text-sm text-muted-foreground">
            Enter lat and long in comma separated values
          </span>
          <Input
            placeholder="Latitude, Longitude"
            value={latLong}
            onChange={(e) => {
              setLatLong(e.target.value);
            }}
            onBlur={(e) => handleBlur()}
          />

        
        </div>
      </div>

      <div className="self-end">
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
        >
          {submitting ? ("Adding...") : ("Add New Location")}
        </Button>
      </div>
    </div>
  )
}
