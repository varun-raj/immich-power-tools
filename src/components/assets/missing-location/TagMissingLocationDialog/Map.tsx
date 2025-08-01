"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from 'leaflet';

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { IPlace } from "@/types/common";
import CustomMarker from "./CustomMarker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MapComponentProps {
  location: IPlace;
  onLocationChange: (place: IPlace) => void;
}

interface MapMouseHandlerProps {
  onMouseDown: (coords: LatLngExpression) => void;
}

const MapMouseHandler = ({ onMouseDown }: MapMouseHandlerProps) => {
  useMapEvents({
    // Handle mouse events
    mousedown: (e) => {
      onMouseDown(e.latlng);
    },
  });
  return null;
};

export default function Map({ location, onLocationChange }: MapComponentProps) {
  const [position, setPosition] = useState<LatLngExpression>([location.latitude, location.longitude]);
  const [locationName, setLocationName] = useState(location.name || "");

  const handleClick = (coords: LatLngExpression) => {
    const normalized = L.latLng(coords);

    setPosition(coords);
    onLocationChange({
      latitude: normalized.lat,
      longitude: normalized.lng,
      name: locationName
    });
  };

  const handleNameChange = (name: string) => {
    setLocationName(name);
    onLocationChange({
      latitude: location.latitude,
      longitude: location.longitude,
      name: name
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Location Name</Label>
        <Input
          placeholder="Enter location name"
          value={locationName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '500px', height: '400px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMouseHandler onMouseDown={handleClick} />
        <CustomMarker position={position} />
      </MapContainer>
    </div>
  );
}