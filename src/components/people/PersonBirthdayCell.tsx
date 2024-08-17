import { IPerson } from '@/types/person'
import React from 'react'

interface IProps {
  person: IPerson
}

export default function PersonBirthdayCell(
  { person }: IProps
) {
  return (
    <div>
      {person.birthDate ? (
        <span>{person.birthDate.toDateString()}</span>
      ) : (
        <span>Unknown</span>
      )}
    </div>
  )
}
