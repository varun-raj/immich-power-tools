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
import TagMissingLocationOSMSearchAndAdd from "./TagMissingLocationOSMSearchAndAdd";
import dynamic from "next/dynamic";
import { useMissingLocationContext } from "@/contexts/MissingLocationContext";

const LazyMap = dynamic(() => import("./Map"), {
  ssr: false
});

interface ITagMissingLocationDialogProps {
  onSubmit: (place: IPlace) => Promise<any>;
}
export default function TagMissingLocationDialog({
  onSubmit,
}: ITagMissingLocationDialogProps) {
  const { selectedIds } = useMissingLocationContext();
  const [open, setOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState<IPlace>({
    latitude: 48.210033,
    longitude: 16.363449,
    name: "Vienna, Austria"
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button size={"sm"} disabled={selectedIds.length === 0}>Tag Location</Button>
      </DialogTrigger>
      <DialogContent className="!w-[600px] !max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tag Missing Location</DialogTitle>
          <DialogDescription>
            Tagging a location will add the location to the selected assets.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="searchOsm" className="border rounded-lg">
          <TabsList className="flex justify-between">
            <TabsTrigger value="searchOsm" className="w-full">Open Street Map</TabsTrigger>
            <TabsTrigger value="search" className="w-full">Immich Geo</TabsTrigger>
            <TabsTrigger value="latlong" className="w-full">Lat &amp; Long</TabsTrigger>
            <TabsTrigger value="maps" className="w-full">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="searchOsm">
            <TagMissingLocationOSMSearchAndAdd onSubmit={onSubmit} onOpenChange={setOpen} location={mapPosition} onLocationChange={setMapPosition} />
          </TabsContent>
          <TabsContent value="search">
            <TagMissingLocationSearchAndAdd onSubmit={onSubmit} onOpenChange={setOpen} />
          </TabsContent>
          <TabsContent value="latlong">
            <TagMissingLocationSearchLatLong onSubmit={onSubmit} onOpenChange={setOpen} location={mapPosition} onLocationChange={setMapPosition} />
          </TabsContent>
          <TabsContent value="maps">
            <div className="flex flex-col gap-6 items-center ">
              <LazyMap location={mapPosition} onLocationChange={setMapPosition} />
            </div>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
