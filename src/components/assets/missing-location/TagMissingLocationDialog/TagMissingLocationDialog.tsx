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
    latitude: 48.0,
    longitude: 16.0,
    name: "home"
  });
 
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>Tag Location</Button>
      </DialogTrigger>
      <DialogContent className="!w-[600px] !max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tag Missing Location</DialogTitle>
          <DialogDescription>
            Tagging a location will add the location to the selected assets.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="search">
          <TabsList className="flex justify-center">
            <TabsTrigger value="search">Search and Pick</TabsTrigger>
            <TabsTrigger value="latlong">
              Lat & Long
            </TabsTrigger>
            <TabsTrigger value="maps">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <TagMissingLocationSearchAndAdd onSubmit={onSubmit} onOpenChange={setOpen} />
          </TabsContent>
          <TabsContent value="latlong">
            <TagMissingLocationSearchLatLong onSubmit={onSubmit}
             onOpenChange={setOpen} location={mapPosition} onLocationChange={setMapPosition} />
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
