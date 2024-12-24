"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchSlash, X } from "lucide-react";
import {
  listSimilarFaces,
  mergePerson,
  searchPeople,
} from "@/handlers/api/people.handler";
import { IPerson } from "@/types/person";
import { Avatar } from "../ui/avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import FaceThumbnail from "./merge/FaceThumbnail";
import ErrorBlock from "../shared/ErrorBlock";
import { cn } from "@/lib/utils";

interface PersonMergeDropdownProps {
  person: IPerson;
  onRemove?: (person: IPerson) => void;
  onComplete?: (mergedPerson: IPerson) => void;
  triggerClassName?: string;
}

export function PersonMergeDropdown({
  person,
  onRemove,
  onComplete,
  triggerClassName,
}: PersonMergeDropdownProps) {
  const [searchedPeople, setSearchedPeople] = useState<IPerson[] | null>(null);
  const [similarPeople, setSimilarPeople] = useState<IPerson[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(true);
  const searchTimer = useRef<NodeJS.Timeout>();
  const [selectedPeople, setSelectedPeople] = useState<IPerson[]>([]);
  const [primaryPerson, setPrimaryPerson] = useState<IPerson>(person);
  const [merging, setMerging] = useState(false);
  const { toast } = useToast();

  const selectedIds = useMemo(
    () => selectedPeople.map((p) => p.id),
    [selectedPeople]
  );

  const handleSearch = (value: string) => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      if (!value || !value.trim().length) {
        setSearchedPeople(null);
        return;
      }
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

  const fetchSuggestions = () => {
    return listSimilarFaces(person.id)
      .then(setSimilarPeople)
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to fetch similar people",
        });
      })
      .finally(() => {
        setSimilarLoading(false);
      });
  };

  const handleSelect = (value: IPerson) => {
    const isAlreadySelected = selectedPeople.some((p) => p.id === value.id);
    if (isAlreadySelected) {
      setSelectedPeople(selectedPeople.filter((p) => p.id !== value.id));
      return;
    }
    setSelectedPeople([...selectedPeople, value]);
    if (primaryPerson.name.length === 0 && value.name.length > 0) {
      setPrimaryPerson(value);
    }
  };

  const handleMerge = () => {
    if (selectedPeople.length === 0) {
      return;
    }
  
    const personIds = selectedPeople.map((p) => p.id);
    setMerging(true);
  
    const mergeInBatches = async (ids: string[], index: number = 0) => {
      if (index >= ids.length) {
        setOpen(false);
        toast({
          title: "Success",
          description: "People merged successfully",
        });
        setMerging(false);
        setSelectedPeople([]);
        setSimilarPeople([]);
        setSimilarLoading(true)
        onComplete?.(primaryPerson);
        return;
      }
  
      const batch = ids.slice(index, index + 5);
      try {
        await mergePerson(person.id, batch);
        mergeInBatches(ids, index + 5);
      } catch {
        toast({
          title: "Error",
          description: "Failed to merge people",
        });
        setMerging(false);
      }
    };
  
    mergeInBatches(personIds);
  };

  const handleRemove = (value: IPerson) => {
    const newSelected = selectedPeople.filter((p) => p.id !== value.id);
    if (primaryPerson.id === value.id) {
      const newPrimary = newSelected[0];
      setPrimaryPerson(newPrimary || person);
    }
    setSelectedPeople(newSelected);
  };

  useEffect(() => {
    if (open && !similarPeople.length) fetchSuggestions();
  }, [open, person.id, similarPeople]);

  useEffect(() => {
    setPrimaryPerson(person);
    setSelectedPeople([]);
  }, [person]);

  const renderPeopleList = (people: IPerson[], title: string) => {
    return (
      <div className="max-h-[400px] min-h-[400px] overflow-y-auto">
        <p className="pb-2 uppercase">{title}</p>
        <div className="grid grid-cols-4 gap-2">
          {people.map((person) => (
            <FaceThumbnail
              key={person.id}
              person={person}
              onSelect={handleSelect}
              selected={selectedIds.includes(person.id)}
            />
          ))}
        </div>
      </div>
    );
  };
  const renderContent = () => {
    if (loading || similarLoading) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <Loader />
        </div>
      );
    }
    if (searchedPeople && searchedPeople?.length === 0) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <p>No Results Found</p>
        </div>
      );
    }

    if (searchedPeople && searchedPeople?.length > 0) {
      return renderPeopleList(searchedPeople, "Search Results");
    }

    if (similarPeople && similarPeople.length === 0) {
      return (
        <ErrorBlock
          title="No Similar People Found"
          description="Please search for the person"
          icon={<SearchSlash />}
        />
      );
    }

    if (similarPeople && similarPeople.length > 0) {
      return renderPeopleList(similarPeople, "Similar People");
    }

    return <p className="text-xs">Please search for people</p>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("!py-0.5 !px-2 text-xs h-7", triggerClassName)}
        >
          Merge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Merge {person.name ? person.name : "Untagged Person"}
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2">
              <p>
                {selectedPeople.length > 0
                  ? `Merging ${selectedPeople.length} people to ${person.name}`
                  : "Search and select people to merge with"}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-1 items-center">
                  <Avatar
                    src={primaryPerson.thumbnailPath}
                    alt={primaryPerson.name}
                    className="w-4 h-4"
                  />
                  <p>{primaryPerson?.name || "Untagged Person"}</p>
                  <CaretDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[person, ...selectedPeople].map((person) => (
                    <DropdownMenuItem
                      key={person.id}
                      onSelect={() => setPrimaryPerson(person)}
                      className="flex gap-1"
                    >
                      <Avatar
                        src={person.thumbnailPath}
                        alt={person.name}
                        className="w-6 h-6"
                      />
                      <span>{person.name || "Untagged Person"}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search people..."
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />

        {selectedPeople.length > 0 ? (
          <div className="flex flex-nowrap overflow-x-auto gap-2 py-2">
            {selectedPeople.map((person) => (
              <div
                key={person.id}
                className="flex border px-1 items-center gap-1 dark:bg-zinc-900 rounded-lg p-1"
              >
                <Avatar
                  src={person.thumbnailPath}
                  alt={person.name}
                  className="w-6 h-6"
                />
                <p className="text-xs text-nowrap">
                  {person.name ? person.name : <span>Untagged person</span>}
                </p>
                <button
                  className="rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200 p-1"
                  onClick={() => handleRemove(person)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="py-4 text-sm text-zinc-500">No Selections Yet</p>
          </div>
        )}

        {renderContent()}
        <DialogFooter>
          <Button
            onClick={() => {
              setSelectedPeople(similarPeople);
            }}
            variant="outline"
          >
            Select All
          </Button>

          <Button
            onClick={() => {
              setOpen(false);
              setSelectedPeople([]);
              setPrimaryPerson(person);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleMerge}
            disabled={selectedPeople.length === 0 || merging}
          >
            Merge {selectedPeople.length + 1} People
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
