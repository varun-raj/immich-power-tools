import {
  IPotentialAlbumsDatesResponse,
  listPotentialAlbumsDates,
} from "@/handlers/api/album.handler";
import React, { use, useEffect, useState } from "react";
import PotentialDateItem from "./PotentialDateItem";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";

export default function PotentialAlbumsDates() {
  const { updateContext } = usePotentialAlbumContext();
  const [dateRecords, setDateRecords] = React.useState<
    IPotentialAlbumsDatesResponse[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    return listPotentialAlbumsDates({})
      .then(setDateRecords)
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  };

  const handleSelect = (date: string) => {
    updateContext({ startDate: date });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-y-auto min-w-[170px] py-4 max-h-[calc(100vh-60px)] min-h-[calc(100vh-60px)]  dark:bg-zinc-900 bg-gray-200 flex flex-col gap-2 px-2">
      {dateRecords.map((record) => (
        <PotentialDateItem
          key={record.date}
          record={record}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
