import React, { useCallback, useMemo, useState } from 'react'
import { IPerson } from '@/types/person';
import { cn } from '@/lib/utils';
import LazyImage from '../ui/lazy-image';
import { PERSON_THUBNAIL_PATH } from '@/config/routes';
import { Input } from '../ui/input';

interface PeopleListProps {
  people: IPerson[];
  onSelect: (person: IPerson) => void;
  selectedIds?: string[];
}

export default function PeopleList({ people, onSelect, selectedIds }: PeopleListProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredPeople = useMemo(() => {
    return people.filter((person) => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [people, searchQuery])

  const isSelected = useCallback((person: IPerson) => {
    return selectedIds?.includes(person.id)
  }, [selectedIds])

  return (
    <div className="flex flex-col overflow-x-hidden gap-2 px-2 pt-2">
      <Input
        placeholder="Search"
        className="w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredPeople.map((person) => (
        <div
          className={cn(
            'flex items-center gap-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md p-1',
            isSelected(person) ? "bg-gray-300 dark:bg-gray-700" : ""
          )}
          key={person.id}
          onClick={() => onSelect(person)}
        >
          <LazyImage
            role="button"
            className={
              cn("cursor-pointer h-10 w-10 min-w-10 rounded-full border-2",
                !!person.name ? "border-green-500" : "border-gray-500",
              )
            }
            src={person.thumbnailPath} alt={person.name} />
          <div className='flex flex-col text-sm'>
            <p>{person.name || "No Name"}</p>
            <p className={
              cn("text-xs text-gray-500 dark:text-gray-400")
            }>{person.assetCount} photos</p>
          </div>
        </div>
      ))}
    </div>
  )
}
