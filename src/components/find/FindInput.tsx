import React, { useState } from 'react'
import inputStyle from './findInputStyle'
import { MentionsInput, Mention } from 'react-mentions'
import { searchPeople } from '@/handlers/api/people.handler';
import mentionStyle from './findMentionStyle';
import classNames from './FindInput.module.css';


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
      placeholder='Search for photos, use @ to search for people'
      style={inputStyle}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch(query);
        }
      }}
      onChange={(e) => setQuery(e.target.value)}>
      <Mention
        trigger="@"
        style={mentionStyle}
        data={handleSearchPeople}
        renderSuggestion={(
          highlightedDisplay,
          focused
        ) => (
          <div className={`user ${focused ? 'focused' : ''} `}>
            {highlightedDisplay.display}
          </div>
        )}
      />
    </MentionsInput>
  )
}
