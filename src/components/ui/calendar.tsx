import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css";

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      captionLayout="dropdown"
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
