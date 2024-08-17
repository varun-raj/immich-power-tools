import { IPerson } from '@/types/person'
import React, { useState } from 'react'
import { DatePicker } from '../ui/datepicker'
import { updatePerson } from '@/handlers/api/people.handler';
import { formatDate } from '@/helpers/date.helper';

interface IProps {
  person: IPerson
}

export default function PersonBirthdayCell(
  { person }: IProps
) {
  const [formData, setFormData] = useState(person);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEdit = (date?: Date | null) => {
    if (!date) return;
    const formatedDate = formatDate(date.toString(), 'yyyy-MM-dd');
    setLoading(true);
    return updatePerson(person.id, {
      birthDate: formatedDate,
    })
      .then(() => {
        
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }



  return <DatePicker date={person.birthDate} onSelect={handleEdit}/>
}
