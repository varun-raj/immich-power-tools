import { IPerson } from '@/types/person'
import React, { useState } from 'react'

import { updatePerson } from '@/handlers/api/people.handler';
import { formatDate } from '@/helpers/date.helper';
import { Input, Popover, Calendar, Button } from 'antd';
import { useToast } from '../ui/use-toast';
// @ts-ignore
import chrono from 'chrono-node'
import dayjs from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';

const DISPLAY_DATE_FORMAT = "MMMM DD, YYYY";

interface IProps {
  person: IPerson
}

export default function PersonBirthdayCell(
  { person }: IProps
) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [textDate, setTextDate] = useState<string | null>(person.birthDate ? formatDate(new Date(person.birthDate), DISPLAY_DATE_FORMAT): "");

  if (person.birthDate) {
    console.log("formatDate(new Date(person.birthDate), DISPLAY_DATE_FORMAT)", formatDate(new Date(person.birthDate), 'MMMM d, YYYY'));
  }
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
        className='w-full' 
        value={textDate || ""}
        placeholder='Enter a date'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const parsedDate = chrono.parseDate(textDate || "");
            if (parsedDate) {
              handleEdit(parsedDate);
              setTextDate(formatDate(parsedDate.toString(), DISPLAY_DATE_FORMAT));
            } else {
              handleEdit(null);
            }
          }
        }}
        disabled={loading}
        onChange={(e) => setTextDate(e.target.value)}
      />
      <Popover content={
        <div className='w-[400px]'>
          <Calendar 
            fullscreen={false} 
            value={person.birthDate ? dayjs(person.birthDate) : undefined}
            onChange={(value) => {
              handleEdit(value?.toDate());
              setTextDate(formatDate(value?.toDate().toString(), DISPLAY_DATE_FORMAT));
            }}
          />
        </div>
      }>
        <Button icon={<CalendarOutlined />} />
      </Popover>
    </div>
  )
}
