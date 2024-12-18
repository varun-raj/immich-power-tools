import L, { Marker as LeafletMarker } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useRef } from 'react';
import { LatLngExpression } from 'leaflet';


interface CustomMarkerProps {
  position: LatLngExpression;
}

export default function CustomMarker({ position } : CustomMarkerProps) {
  const markerRef = useRef<LeafletMarker|null>(null);

  return (
    <Marker
      position={position}
      ref={markerRef}
      eventHandlers={{
        mouseover: () => {
          if (markerRef.current) {
            markerRef.current.openPopup();
          }
        },
        mouseout: () => {
          if (markerRef.current) {
            markerRef.current.closePopup();
          }
        },
      }}
    >
      <Popup>
        Position: {L.latLng(position).toString()}
      </Popup>
    </Marker>
  );
}