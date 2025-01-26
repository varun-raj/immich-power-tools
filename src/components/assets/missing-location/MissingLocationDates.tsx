import React, { use, useEffect, useState } from "react";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";
import { IMissingLocationDatesResponse, listMissingLocationAlbums, listMissingLocationDates } from "@/handlers/api/asset.handler";
import MissingLocationDateItem from "./MissingLocationDateItem";
import { useMissingLocationContext } from "@/contexts/MissingLocationContext";
import { useRouter } from "next/router";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SortAsc, SortDesc } from "lucide-react";

interface IMissingLocationDatesProps {
  groupBy: string;

}
export default function MissingLocationDates({ groupBy }: IMissingLocationDatesProps) {
  const { dates, updateContext } = useMissingLocationContext();
  const router = useRouter();
  const [filters, setFilters] = useState<{ sortBy: string, sortOrder: string }>({ sortBy: "date", sortOrder: "desc" });
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    const func = groupBy === "album" ? listMissingLocationAlbums : listMissingLocationDates
    updateContext({ dates: [] })
    return func({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
      .then((r) => updateContext({ dates: r }))
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const handleSelect = (date: string) => {
    if (groupBy === "album") {
      updateContext({ albumId: date });
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          albumId: date,
          groupBy: "album",
          startDate: undefined
        },
      });
    } else {
      updateContext({ startDate: date });
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          startDate: date,
          groupBy: "date",
          albumId: undefined
        },
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, groupBy]);

  return (
    <div className="min-w-[200px] max-w-[200px] sticky top-0 py-4 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)]  border-r border-gray-200 dark:border-zinc-800 flex flex-col gap-2 px-2">
      <div className="flex justify-between items-center gap-2">
        {groupBy === "album" ? (
          <p className="text-sm text-gray-500 dark:text-zinc-400">Asset Count</p>
        ) : (<Select
          defaultValue={filters.sortBy}
          onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="!p-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent defaultValue={filters.sortBy}>
            <SelectGroup title="Sort by">
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="asset_count">Asset Count</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>)}
        <div>
          <Button variant="ghost" size="sm" onClick={() =>
            setFilters({
              ...filters,
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc"
            })}>
            {filters.sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto flex flex-col gap-2">
        {dates.map((record) => (
          <MissingLocationDateItem
            key={record.value}
            record={record}
            groupBy={groupBy as "date" | "album"}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
