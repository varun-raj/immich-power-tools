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

interface ITagMissingLocationDialogProps {
  onSubmit: (place: IPlace) => Promise<any>;
}
export default function TagMissingLocationDialog({
  onSubmit,
}: ITagMissingLocationDialogProps) {
  
  const [open, setOpen] = useState(false);
 
  
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
        <Tabs defaultValue="search" className="border rounded-lg">
          <TabsList className="flex justify-between">
            <TabsTrigger value="search">Search and Pick</TabsTrigger>
            <TabsTrigger value="latlong">
              Latitude and Longitude
              
            </TabsTrigger>
            <TabsTrigger value="google">Google Maps</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <TagMissingLocationSearchAndAdd onSubmit={onSubmit} onOpenChange={setOpen} />
          </TabsContent>
          <TabsContent value="latlong">
            <TagMissingLocationSearchLatLong onSubmit={onSubmit} onOpenChange={setOpen} />
          </TabsContent>
          <TabsContent value="google">
            <div className="py-10 flex flex-col gap-6 items-center">
              <MapPinCheck size={48}  className="text-gray-500"/>
              <p>Google Maps Coming Soon...</p>
            </div>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
