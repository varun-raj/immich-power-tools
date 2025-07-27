import React, { useEffect, useState } from "react";
import { listMissingLocationAlbums, listMissingLocationDates } from "@/handlers/api/asset.handler";
import MissingLocationDateItem from "./MissingLocationDateItem";
import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";
import { useRouter } from "next/router";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SortAsc, SortDesc } from "lucide-react";

interface IMissingLocationDatesProps {
  groupBy: string;

}
export default function MissingLocationDates({ groupBy }: IMissingLocationDatesProps) {
  const { config, updateContext } = usePhotoSelectionContext();
  const { dates } = config;

  const router = useRouter();
  const [filters, setFilters] = useState<{ sortBy: string, sortOrder: string }>({
    sortBy: groupBy === "album" ? "name" : "date",
    sortOrder: "desc"
  });
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    const func = groupBy === "album" ? listMissingLocationAlbums : listMissingLocationDates
    updateContext({ config: { ...config, dates: [] } })
    setLoading(true);
    return func({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
      .then((r) => updateContext({ config: { ...config, dates: r } }))
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const handleSelect = (value: string) => {
    if (groupBy === "album") {
      updateContext({ config: { ...config, albumId: value, startDate: undefined } });
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          albumId: value,
          groupBy: "album",
          startDate: undefined
        },
      });
    } else {
      updateContext({ config: { ...config, startDate: value, albumId: undefined } });
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          startDate: value,
          groupBy: "date",
          albumId: undefined
        },
      });
    }
  };

  useEffect(() => {
    setFilters({
      sortBy: groupBy === "album" ? "name" : "date",
      sortOrder: "desc"
    });
  }, [groupBy]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="min-w-[200px] max-w-[200px] sticky top-0 py-2 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)]  border-r border-gray-200 dark:border-zinc-800 flex flex-col gap-2 px-2">
      <div className="flex justify-between items-center gap-2">
        {groupBy === "album" ? (
          <p className="text-sm text-gray-500 dark:text-zinc-400">Asset Count</p>
        ) : (<Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger className="!p-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
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
        {dates?.map((record) => (
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
