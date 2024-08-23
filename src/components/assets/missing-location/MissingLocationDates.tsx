import React, { use, useEffect, useState } from "react";
import { usePotentialAlbumContext } from "@/contexts/PotentialAlbumContext";
import { IMissingLocationDatesResponse, listMissingLocationDates } from "@/handlers/api/asset.handler";
import MissingLocationDateItem from "./MissingLocationDateItem";
import { useMissingLocationContext } from "@/contexts/MissingLocationContext";

export default function MissingLocationDates() {
  const { updateContext } = useMissingLocationContext();
  const [dateRecords, setDateRecords] = React.useState<
    IMissingLocationDatesResponse[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    return listMissingLocationDates({})
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
        <MissingLocationDateItem
          key={record.date}
          record={record}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
