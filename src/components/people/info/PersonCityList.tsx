import { useConfig } from '@/contexts/ConfigContext';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react'

interface PersonCityListProps {
  cities: {
    city: string;
    country: string;
    count: number;
  }[]
  personId: string;
}

export const PersonCity = ({ city, count, personId }: { city: string, count: number, personId: string }) => {
  const { exImmichUrl } = useConfig();
  const url = `${exImmichUrl}/search?query=${JSON.stringify({ city, personIds: [personId] })}`;
  return (
    <div className="flex flex-col gap-2 p-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-md shadow border relative">
      <span className="text-sm truncate">{city}</span>
      <span className="text-sm truncate text-gray-500 dark:text-gray-400">{count} occurrences</span>
      <Link href={url} target="_blank" className="absolute top-2 right-2" >
        <ExternalLink className=" w-4 h-4" />
      </Link>
    </div>
  )
}
export default function PersonCityList({ cities, personId }: PersonCityListProps) {

  const groupedCities = useMemo(() => {
    const countries: {
      label: string;
      cities: {
        city: string;
        count: number;
      }[];
    }[] = [];
    const uniqueCountries = cities.map((city) => city.country).filter((country, index, self) => self.indexOf(country) === index);
    uniqueCountries.forEach((country) => {
      countries.push({ label: country, cities: cities.filter((city) => city.country === country) });
    });
    return countries;
  }, [cities]);

  return (
    <div className='flex flex-col gap-4'>
      {groupedCities.map((country) => (
        <div key={country.label} className="flex flex-col gap-2 w-full">
          {/* Country */}
          <span className="font-medium">{country.label}</span>
          {/* Cities */}
          <div className='grid grid-cols-2 gap-2 md:grid-cols-5 w-full'>
            {country.cities.map((city) => (
              <PersonCity key={city.city} city={city.city} count={city.count} personId={personId} />
          ))}
          </div>
        </div>
      ))}
    </div>
  )
}
