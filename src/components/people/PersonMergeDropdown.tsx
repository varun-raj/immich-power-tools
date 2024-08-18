"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Merge } from "lucide-react";
import { mergePerson, searchPeople } from "@/handlers/api/people.handler";
import { IPerson } from "@/types/person";
import { set } from "date-fns";
import { CommandLoading } from "cmdk";
import { Avatar } from "../ui/avatar";

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

interface PersonMergeDropdownProps {
  person: IPerson;
}
export function PersonMergeDropdown(
  { person }: PersonMergeDropdownProps
) {
  const [searchedPeople, setSearchedPeople] = React.useState<IPerson[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const searchTimer = React.useRef<NodeJS.Timeout>();

  const handleSearch = (value: string) => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      setLoading(true);
      if (!value) {
        setSearchedPeople([]);
        setLoading(false);
        return;
      }

      return searchPeople(value)
        .then(setSearchedPeople)
        .finally(() => {
          setLoading(false);
        });
    }, 500);
  };

  const handleSelect = (value: IPerson) => {
    setOpen(false);
    return mergePerson(person.id, value.id)
    .then(() => {
      
    })
  };

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="!py-0.5 !px-2 text-xs h-7">
            Merge
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="center">
          <Command>
            <CommandInput
              placeholder="Change status..."
              onValueChange={handleSearch}
            />
            <CommandList>
              {loading && <CommandLoading />}
              <CommandGroup heading="People">
                {searchedPeople.map((person) => (
                  <CommandItem
                    key={person.id}
                    value={person.name}
                    onSelect={() => {
                      handleSelect(person);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Avatar
                      src={person.thumbnailPath}
                      alt={person.name}
                      className="w-6 h-6"
                    />
                    <span>{person.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
