"use client"

import * as React from "react"
import { Check, Filter } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export interface IComboBoxOption  { label: string; value: string }

export interface IComboBoxProps {
  options: IComboBoxOption[]
  onSelect?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  closeOnSelect?: boolean
}

export function Combobox(
  { options, onSelect, onOpenChange, closeOnSelect }: IComboBoxProps
) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={(openState) => {
      setOpen(openState)
      onOpenChange?.(openState)
    }}>
      <PopoverTrigger asChild>
        <Filter />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onSelect?.(currentValue)
                    if (closeOnSelect) {
                      setOpen(false)
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 min-h-4 min-w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label.trim()}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
