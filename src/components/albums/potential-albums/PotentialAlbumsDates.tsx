import {
  IPotentialAlbumsDatesResponse,
  listPotentialAlbumsDates,
} from "@/handlers/api/album.handler";
import React, { use, useEffect, useState } from "react";
import PotentialDateItem from "./PotentialDateItem";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";
import { useRouter } from "next/router";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDownIcon, SortAsc, SortDesc } from "lucide-react";

export default function PotentialAlbumsDates() {
  const router = useRouter();
  const { updateContext } = usePotentialAlbumContext();
  const [dateRecords, setDateRecords] = React.useState<
    IPotentialAlbumsDatesResponse[]
  >([]);
  const [filters, setFilters] = useState<{ sortBy: string, sortOrder: string }>({ sortBy: "date", sortOrder: "desc" });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    return listPotentialAlbumsDates({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
      .then(setDateRecords)
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const handleSelect = (date: string) => {
    updateContext({ startDate: date });
    router.push({
      pathname: router.pathname,
      query: { startDate: date },
    })
  };


  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="min-w-[200px] py-4 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)]  border-r border-gray-200 dark:border-zinc-800 flex flex-col gap-2 px-1">
      <div className="flex justify-between items-center gap-2">
        <Select
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
        </Select>
        <div>
          <Button variant="default" size="sm" onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}>
            {filters.sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto">
        {dateRecords.map((record) => (
          <PotentialDateItem
            key={record.date}
            record={record}
            onSelect={handleSelect}
          />
        ))}
    </div>
    </div>
  );
}
