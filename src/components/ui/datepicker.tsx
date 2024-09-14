"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface IProps {
  date?: Date | null
  onSelect?: (date?: Date | null) => any
  iconOnly?: boolean
}
export function DatePicker(
  { date: _date, onSelect, iconOnly }: IProps
) {
  const [date, setDate] = React.useState<Date | null>(_date || null)

  const handleSelect = (date?: Date) => {
    setDate(date || null)
    onSelect?.(date)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal flex gap-1",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-3 w-3" />
          {!iconOnly && <span>{date ? format(date, "PPP") : <span>Pick a date</span>}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
