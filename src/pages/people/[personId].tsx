import PageLayout from '@/components/layouts/PageLayout';
import PersonCityList from '@/components/people/info/PersonCityList';
import Header from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { ASSET_THUMBNAIL_PATH, PERSON_THUBNAIL_PATH } from '@/config/routes';
import { useConfig } from '@/contexts/ConfigContext';
import { getPersonInfo } from '@/handlers/api/person.handler';
import { IAlbum } from '@/types/album';
import { IPerson } from '@/types/person'
import { GalleryThumbnails,  MapPin, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

interface IPersonFullInfo extends IPerson {
  albums: {
    id: string;
    name: string;
    assetCount: number;
    thumbnail: string;
  }[];
  cities: {
    city: string;
    country: string;
    count: number;
  }[];
}

export default function PersonPage() {
  const { exImmichUrl } = useConfig();
  const router = useRouter();
  const { pathname, query } = router;
  const { personId } = router.query as { personId: string };
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState<IPersonFullInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const fetchPersonInfo = async (personId: string) => {
    setLoading(true);
    getPersonInfo(personId).then(setPerson).catch((err) => {
      setErrorMessage(err.message);

    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchPersonInfo(personId);
  }, [personId]);

  const renderContent = () => {
    if (query.tab === "cities") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-medium">Cities</span>
          </div>
            <PersonCityList cities={person?.cities || []} personId={personId} />
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Albums {person?.albums.length}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {person?.albums.map((album) => (
            <div key={album.id} className="flex flex-col gap-2 w-full">
              <div className="relative w-full h-[200px]">
                <Image src={ASSET_THUMBNAIL_PATH(album.thumbnail)}
                  alt={album.name}
                  width={100}
                  height={100}
                  className="rounded-md w-full h-full object-cover" />
              </div>
              <Link href={`${exImmichUrl}/albums/${album.id}`} target="_blank" className="text-sm font-medium truncate">{album.name}</Link>
              <span className="text-sm text-gray-500 truncate">{album.assetCount} Occurences</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) return <Loader />
  if (errorMessage) return <div>{errorMessage}</div>;
  if (!person) return <div>Person not found</div>;


  return (
    <PageLayout className="!p-0 !mb-0" title={person?.name}>
      <Header
        title={person?.name}
        leftComponent={
          <div className="flex items-center gap-2">
            <Image src={PERSON_THUBNAIL_PATH(person?.id)}
              alt={person?.name} width={32} height={32} className="rounded-full" />
            <span className="font-medium">{person?.name}</span>
          </div>
        }
      />
      <div className="flex divide-y">
        <div className="overflow-y-auto sticky top-0 min-w-[200px] py-4 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)]  dark:bg-zinc-900 bg-gray-200 flex flex-col gap-2 px-2">
          <ul className="flex flex-col gap-1">
            <li>
              <Link href={{
                pathname: pathname,
                query: {
                  ...query,
                  tab: "albums"
                }
              }} className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-800">
                <GalleryThumbnails size={14} />
                <span className="text-sm font-medium">Albums</span>
              </Link>
            </li>
            <li>
              <Link href={{
                pathname: pathname,
                query: {
                  ...query,
                  tab: "cities"
                }
              }} className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-800">
                <MapPin size={14} />
                <span className="text-sm font-medium">Cities</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4  flex-1">
          {renderContent()}
        </div>
      </div>
    </PageLayout>
  )
}
