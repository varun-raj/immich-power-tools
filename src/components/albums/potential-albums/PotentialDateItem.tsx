import { usePhotoSelectionContext } from "@/contexts/PhotoSelectionContext";
import { IPotentialAlbumsDatesResponse } from "@/handlers/api/album.handler";
import { formatDate } from "@/helpers/date.helper";
import { parseDate } from "@/helpers/date.helper";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef } from "react";

interface IProps {
  record: IPotentialAlbumsDatesResponse;
  onSelect: (date: string) => void;
}
export default function PotentialDateItem({ record, onSelect }: IProps) {
  const { config } = usePhotoSelectionContext();
  const { startDate } = config;

  const itemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (startDate === record.date) {
      itemsRef.current?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }
  }, [startDate, record.date]);

  const dateLabel = useMemo(() => {
    try {
      return formatDate(parseDate(record.date, "yyyy-MM-dd").toISOString(), "do MMM yyyy")
    } catch (e) {
      console.error("Error formatting date label:", e);
      return record.date;
    }
  }, [record.date])
  return (
    <div
      role="button"
      onClick={() => onSelect(record.date)}
      key={record.date}
      ref={itemsRef}
      className={
        cn("flex gap-1 flex-col p-2 py-1 rounded-lg hover:dark:bg-zinc-800 border border-transparent hover:bg-zinc-100",
        startDate === record.date ? "bg-zinc-100 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700" : "")
      }
    >
      <p className="text-sm">{dateLabel}</p>
      <p className="text-xs text-foreground/50">{record.asset_count} Orphan Assets</p>
    </div>
  );
}
