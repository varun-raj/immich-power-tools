import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPlace } from "@/types/common";
import React, { useState } from "react";
import TagMissingLocationSearchAndAdd from "./TagMissingLocationSearchAndAdd";
import TagMissingLocationSearchLatLong from "./TagMissingLocationSearchLatLong";
import { MapPinCheck } from "lucide-react";
import TagMissingLocationOSMSearchAndAdd from "./TagMissingLocationOSMSearchAndAdd";
import dynamic from "next/dynamic";

const LazyMap = dynamic(() => import("./Map"), {
  ssr: false
});

interface ITagMissingLocationDialogProps {
  onSubmit: (place: IPlace) => Promise<any>;
}
export default function TagMissingLocationDialog({
  onSubmit,
}: ITagMissingLocationDialogProps) {
  
  const [open, setOpen] = useState(false);
  const [mapPosition,setMapPosition] = useState<IPlace>({
    latitude: 48.210033,
    longitude: 16.363449,
    name: "Vienna"
  });
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tag Missing Location</Button>
      </DialogTrigger>
      <DialogContent className="!w-[600px] !max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tag Missing Location</DialogTitle>
          <DialogDescription>
            Tagging a location will add the location to the selected assets.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="search" className="border rounded-lg">
          <TabsList className="flex justify-between">
          <TabsTrigger value="search">Immich Search</TabsTrigger>
          <TabsTrigger value="searchOsm">OSM Search</TabsTrigger>
          <TabsTrigger value="latlong">
              Latitude and Longitude
            </TabsTrigger>
            <TabsTrigger value="maps">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <TagMissingLocationSearchAndAdd onSubmit={onSubmit} onOpenChange={setOpen} />
          </TabsContent>
          <TabsContent value="searchOsm">
            <TagMissingLocationOSMSearchAndAdd onSubmit={onSubmit} onOpenChange={setOpen} location={mapPosition} onLocationChange={setMapPosition}  />
          </TabsContent>
          <TabsContent value="latlong">
            <TagMissingLocationSearchLatLong onSubmit={onSubmit} onOpenChange={setOpen} location={mapPosition} onLocationChange={setMapPosition} />
          </TabsContent>
          <TabsContent value="maps">
            <div className="py-10 flex flex-col gap-6 items-center ">
              <LazyMap location={mapPosition} onLocationChange={setMapPosition} />
            </div>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
