"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Merge } from "lucide-react";
import { mergePerson, searchPeople } from "@/handlers/api/people.handler";
import { IPerson } from "@/types/person";
import { set } from "date-fns";
import { CommandLoading } from "cmdk";
import { Avatar } from "../ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";

interface PersonMergeDropdownProps {
  person: IPerson;
  onRemove?: (person: IPerson) => void;
}
export function PersonMergeDropdown({
  person,
  onRemove,
}: PersonMergeDropdownProps) {
  const [searchedPeople, setSearchedPeople] = useState<IPerson[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchTimer = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

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
        onRemove?.(person);
      })
      .then(() => {
        toast({
          title: "Success",
          description: "Person merged successfully",
        });
      });
  };

  useEffect(() => {
    if (open) handleSearch("");
  }, [open]);

  return (
    <div className="flex items-center space-x-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="!py-0.5 !px-2 text-xs h-7">
            Merge
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
