import Header from '@/components/shared/Header'
import { useConfig } from '@/contexts/ConfigContext';
import React, { useEffect, useMemo, useState } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import PageLayout from '@/components/layouts/PageLayout';
import { getAssetGeoHeatmap, IHeatMapParams } from '@/handlers/api/asset.handler';
import { useTheme } from 'next-themes';
import { MapPinX, X } from 'lucide-react';
import AlbumDropdown from '@/components/shared/AlbumDropdown';
import PeopleDropdown from '@/components/shared/PeopleDropdown';
import { Button } from '@/components/ui/button';

interface IHeatMapProps {
  filters: IHeatMapParams;
}

const HeatMap = ({ filters }: IHeatMapProps) => {

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

    getAssetGeoHeatmap(filters).then((data) => {
      heatmap.setData([]);
      heatmap.setData(data.map(([lng, lat]: [number, number]) => ({
        location: new google.maps.LatLng(lat, lng),
        weight: 10
      })));
    });

  }, [heatmap, filters]);

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
  const [filters, setFilters] = useState<{
    albumIds?: string
    peopleIds?: string
  }>({ });

  useEffect(() => {
    if (theme === 'light') {
      setMapId("");
    } else {
      setMapId('7a9e2ebecd32a903');
    }
  }, [theme]);


  return (
    <PageLayout className="!p-0 !mb-0">
      <Header leftComponent="Geo Heatmap" rightComponent={
        <>
          <AlbumDropdown albumIds={filters.albumIds ? [filters.albumIds] : []} onChange={(albumIds) => {
            setFilters({
              ...filters,
              albumIds: albumIds?.[0]
            })
          }} />
          <PeopleDropdown peopleIds={filters.peopleIds ? [filters.peopleIds] : []} onChange={(peopleIds) => {
            setFilters({
              ...filters,
              peopleIds: peopleIds?.[0]
            })
          }} />
          <Button 
            variant="default" size="sm" 
            disabled={Object.keys(filters).length === 0}
            onClick={() => setFilters({})}>
            <X size={16} /> Clear
          </Button>
        </>
      } />
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

            <HeatMap filters={filters} />
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
