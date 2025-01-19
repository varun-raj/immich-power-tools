import Header from '@/components/shared/Header'
import { useConfig } from '@/contexts/ConfigContext';
import React, { useEffect, useMemo, useState } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import PageLayout from '@/components/layouts/PageLayout';
import { getAssetGeoHeatmap } from '@/handlers/api/asset.handler';
import { useTheme } from 'next-themes';
import { MapPinX } from 'lucide-react';


const HeatMap = () => {
  
  const map = useMap();
  const visualization = useMapsLibrary('visualization');

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new google.maps.visualization.HeatmapLayer({
      radius: 20,
      opacity: 0.5
    });

  }, [visualization]);

  useEffect(() => {
    if (!heatmap) return;

    getAssetGeoHeatmap().then((data) => {
      heatmap.setData(data.map(([lng, lat]: [number, number]) => ({
        location: new google.maps.LatLng(lat, lng),
        weight: 10
      })));
    });

  }, [heatmap]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmap, map]);

  return null;
}

export default function GeoHeatmap() {
  const { googleMapsApiKey } = useConfig();
  const { theme } = useTheme();
  const [mapId, setMapId] = useState('7a9e2ebecd32a903');

  useEffect(() => {
    if (theme === 'light') {
      setMapId("");
    } else {
      setMapId('7a9e2ebecd32a903');
    }
  }, [theme]);


  return (
    <PageLayout className="!p-0 !mb-0">
      <Header leftComponent="Geo Heatmap" />
      <div className='h-full w-full'>
        {googleMapsApiKey ? (
          <APIProvider apiKey={googleMapsApiKey}>
          <Map
            defaultCenter={{ lat: 0, lng: 0 }}
            mapId={mapId}
            defaultZoom={2}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            className='h-full w-full'
          />

          <HeatMap />
        </APIProvider>
        ) : (
          <div className='h-full w-full flex items-center justify-center flex-col gap-2'>
            <MapPinX className='w-10 h-10 text-muted-foreground' />
            <p className='text-muted-foreground'>No Google Maps API key found</p>
            <p className='text-muted-foreground'>
              Please create and add your Google Maps API key in the env file under <kbd className='bg-zinc-200 text-black dark:text-white px-1 py-0.5 rounded-md dark:bg-zinc-500'>GOOGLE_MAPS_API_KEY</kbd>.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
