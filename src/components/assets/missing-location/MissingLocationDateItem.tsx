import { useMissingLocationContext } from "@/contexts/MissingLocationContext";

import { IMissingLocationDatesResponse } from "@/handlers/api/asset.handler";
import { parseDate, formatDate } from "@/helpers/date.helper";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

interface IProps {
  record: IMissingLocationDatesResponse;
  onSelect: (date: string) => void;
  groupBy: "date" | "album";
}
export default function MissingLocationDateItem({ record, onSelect, groupBy }: IProps) {
  const { startDate } = useMissingLocationContext()

  const dateLabel = useMemo(() => {
    if (groupBy === "album") {  
      return record.label
    }
    if (!record.label) return "Unknown"
    try {
      return formatDate(parseDate(record.label, "yyyy-MM-dd").toISOString(), "do MMM yyyy")
    } catch (e) {
      return record.label
    }
  }, [record.label, groupBy])

  return (
    <div
      role="button"
      onClick={() => onSelect(record.value)}
      key={record.label}
      className={
        cn("flex gap-1 flex-col p-1 rounded-lg hover:dark:bg-zinc-800 border border-transparent hover:bg-zinc-100",
        startDate === record.label ? "bg-zinc-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700" : "")
      }
    >
      <p className="text-sm truncate">{dateLabel}</p>
      <p className="text-xs text-foreground/50">{record.asset_count} Assets</p>
    </div>
  );
}
