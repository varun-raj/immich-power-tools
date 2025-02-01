import React, { useEffect, useState } from 'react'
import { IPerson } from '@/types/person';
import { IPersonListFilters, listPeople } from '@/handlers/api/people.handler';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IPeopleDropdownProps {
  peopleIds?: string[];
  onChange: (peopleIds: string[]) => void;
}
export default function PeopleDropdown({ peopleIds, onChange }: IPeopleDropdownProps) {
  const [people, setPeople] = useState<IPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeopleIds, setSelectedPeopleIds] = useState(peopleIds);
  const [filters, setFilters] = useState<IPersonListFilters>({
    page: 1,
    perPage: 10000,
    sort: "createdAt",
    sortOrder: "desc",
    visibility: "visible",
    type: "named",
  });

  const fetchPeople = async () => {
    setLoading(true);
    return listPeople(filters).then((people) => setPeople(people.people)).catch((error) => setError(error)).finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPeople();
  }, [filters]);

  useEffect(() => {
    if (peopleIds) {
      setSelectedPeopleIds(peopleIds);
    } else {
      setSelectedPeopleIds([]);
    }
  }, [peopleIds]);

  return (
    <div>
      <Select onValueChange={(value) => {
        if (value) {
          setSelectedPeopleIds([value])
          onChange([value])
        } else {
          setSelectedPeopleIds([])
          onChange([])
        }
      }} value={selectedPeopleIds?.[0] ?? ""}>
        <SelectTrigger className='!p-2'>
          <SelectValue placeholder={'Select people'} />
        </SelectTrigger>
        <SelectContent >
          {people.map((person) => (
            <SelectItem key={person.id} value={person.id}>{person.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}