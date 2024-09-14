import { IPerson } from '@/types/person'
import React, { useState } from 'react'
import { DatePicker } from '../ui/datepicker'
import { updatePerson } from '@/handlers/api/people.handler';
import { formatDate } from '@/helpers/date.helper';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
// @ts-ignore
import chrono from 'chrono-node'



interface IProps {
  person: IPerson
}

export default function PersonBirthdayCell(
  { person }: IProps
) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [textDate, setTextDate] = useState<string | null>(person.birthDate ? formatDate(person.birthDate?.toString(), 'PPP'): "");

  const handleEdit = (date?: Date | null) => {
    const formatedDate = date ? formatDate(date.toString(), 'yyyy-MM-dd') : null;
    setLoading(true);
    return updatePerson(person.id, {
      birthDate: formatedDate,
    })
      .then(() => {
        toast({
          title: "Success",
          description: "Person updated successfully",
        })
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }



  return (
    <div className='flex gap-1'>
      <Input 
        className='' 
        value={textDate || ""}
        placeholder='Enter a date'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const parsedDate = chrono.parseDate(textDate || "");
            if (parsedDate) {
              handleEdit(parsedDate);
              setTextDate(formatDate(parsedDate.toString(), 'PPP'));
            } else {
              handleEdit(null);
            }
          }
        }}
        disabled={loading}
        onChange={(e) => setTextDate(e.target.value)}
      />
      <DatePicker date={person.birthDate} onSelect={handleEdit} iconOnly/>
    </div>
  )
}
