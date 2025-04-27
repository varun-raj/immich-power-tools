import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";

import { IMissingLocationDatesResponse } from "@/handlers/api/asset.handler";
import { parseDate, formatDate } from "@/helpers/date.helper";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef } from "react";

interface IProps {
  record: IMissingLocationDatesResponse;
  onSelect: (date: string) => void;
  groupBy: "date" | "album";
}

export default function MissingLocationDateItem({ record, onSelect, groupBy }: IProps) {
  const { config } = usePhotoSelectionContext();
  const { startDate, albumId } = config;

  const itemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentIdentifier = groupBy === "album" ? albumId : startDate;
    if (currentIdentifier === record.value) {
      itemsRef.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, [startDate, albumId, groupBy, record.value]);

  const displayLabel = useMemo(() => {
    if (groupBy === "album") {
      return record.label;
    }
    if (!record.label) return "Unknown Date";
    try {
      return formatDate(parseDate(record.label, "yyyy-MM-dd").toISOString(), "do MMM yyyy");
    } catch (e) {
      console.error("Error formatting date label:", e);
      return record.label;
    }
  }, [record.label, groupBy]);

  const isSelected = useMemo(() => {
    return groupBy === "album" ? albumId === record.value : startDate === record.value;
  }, [groupBy, albumId, startDate, record.value]);

  return (
    <div
      role="button"
      onClick={() => onSelect(record.value)}
      key={record.value}
      className={
        cn("flex gap-1 flex-col p-1 rounded-lg hover:dark:bg-zinc-800 border border-transparent hover:bg-zinc-100",
        isSelected ? "bg-zinc-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700" : "")
      }
      ref={itemsRef}
    >
      <p className="text-sm truncate">{displayLabel}</p>
      <p className="text-xs text-foreground/50">{record.asset_count} Assets</p>
    </div>
  );
}
