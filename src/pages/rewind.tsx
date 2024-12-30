import React, { useEffect, useMemo, useState } from 'react'
import { Player } from '@remotion/player';

import { IntroComposition } from '../../remotion/Composition';
import PageLayout from '@/components/layouts/PageLayout';
import Header from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { getRewindStats } from '@/handlers/api/common.handler';
import { ASSET_PREVIEW_PATH, ASSET_THUMBNAIL_PATH, PERSON_THUBNAIL_PATH } from '@/config/routes';
import Loader from '@/components/ui/loader';

interface IStats {
  numberOfPhotos: number;
  countriesInYear: any[];
  countOfCities: number;
  albumsWithMostPhotos: any[];
  peopleWithMostPhotos: any[];
  favoritedAssets: string[];
}

const getScenes = (stats: IStats) => [
  {
    message: "Welcome Varun!",
    type: "WELCOME",
    emoji: "👋",
    data: {},

  },
  {
    message: "2024! So much memories!",
    type: "TITLE",
    emoji: "📅",
    data: {
      photos: stats.numberOfPhotos,
    },

  },
  {
    message: `You've been to ${stats.countriesInYear.length} new countries!`, type: "COUNTRY", emoji: "🌍", data: {
      countries: stats.countriesInYear,
    },

  },
  {
    message: `And ${stats.countOfCities} new cities!`, type: "CITY", emoji: "🏙️", data: {
      cities: stats.countOfCities,
    },

  },
  {
    message: "Here are some of my favorite memories from this year!", type: "MEMORY", emoji: "🎉", data: {
      photos: stats.albumsWithMostPhotos,
      images: stats.favoritedAssets.map((assetId) => ASSET_THUMBNAIL_PATH(assetId)),
    },

  },
  {
    message: "The most memory filled album of all time!", type: "ALBUM", emoji: "📸", data: {
      photos: stats.albumsWithMostPhotos,
      albums: stats.albumsWithMostPhotos.map((album) => ({
        name: album.name,
        cover: ASSET_THUMBNAIL_PATH(album.cover),
      })),
    },

  },
  {
    message: "You made so much memory with", type: "FRIEND", emoji: "👯", data: {
      friends: stats.peopleWithMostPhotos.map((person) => ({
        name: person.name,
        cover: PERSON_THUBNAIL_PATH(person.id),
      })),
    },
  },
  {
    message: "Lets see what 2025 has in store!", type: "END", emoji: "🚀", data: {

    },
  },
]


export default function RewindPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    getRewindStats().then((stats) => {
      setStats(stats);
      setLoading(false);
    }).catch((error) => {
      setError(error);
      setLoading(false);
    });
  }

  const scenes = useMemo(() => {
    if (!stats) return [];
    return getScenes(stats);
  }, [stats]);

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loader />
  if (error) return <div>Error: {error}</div>;

  return (
    <PageLayout>
      <div className="flex justify-center flex-col items-center w-full h-full gap-2">
        <p className='text-2xl font-bold'>
          Your 2024 Rewind 🚀
        </p>
        <Player
          className="rounded-lg"
          component={IntroComposition}
          inputProps={{ scenes: scenes }}
          durationInFrames={scenes.length * 120}
          compositionWidth={720}
          compositionHeight={1280}
          fps={30}
          style={{
            width: 720 / 2,
            height: 1280 / 2,
          }}
          controls
        />
      </div>
    </PageLayout>
  )
}
