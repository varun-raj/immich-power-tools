import React, { useState } from 'react'
import style from './findInputStyle'
import { MentionsInput, Mention } from 'react-mentions'
import { searchPeople } from '@/handlers/api/people.handler';
import mentionStyle from './findMentionStyle';
import { PERSON_THUBNAIL_PATH } from '@/config/routes';
import Image from 'next/image';

interface FindInputProps {
  onSearch: (query: string) => void;
}

export default function FindInput({ onSearch }: FindInputProps) {

  const [query, setQuery] = useState("");

  const handleSearchPeople = async (e: any, callback: any) => {
    if (!e.length) return [];
    return searchPeople(e).then((people) => people.map((person: any) => ({
      id: person.id,
      display: person.name,
    }))).then((people) => callback(people));
  }

  return (
    <MentionsInput
      value={query}
      singleLine={true}
      style={style}
      className='w-full border border-gray-200 rounded-md p-2'
      classNames={{
        control: 'w-full border border-gray-200 rounded-md p-2',
        input: 'w-full border border-gray-200 rounded-md p-2 w-full',
      }}
      placeholder='Search for people or tags'
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch(query);
        }
      }}
      onChange={(e) => setQuery(e.target.value)}>
      <Mention
        trigger="@"
        data={handleSearchPeople}
        style={mentionStyle}
        renderSuggestion={(
          highlightedDisplay,
          focused
        ) => (
          <div className={`user ${focused ? 'focused' : ''}`}>
            
            {highlightedDisplay.display}
          </div>
        )}
      />
    </MentionsInput>
  )
}
