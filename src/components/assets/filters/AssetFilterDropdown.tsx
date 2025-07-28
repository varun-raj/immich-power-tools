"use client";

import * as React from "react";
import { ListFilter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAssetFilters } from "@/contexts/AssetFilterContext";

interface AssetFilterDropdownProps {
  className?: string;
}

const filterLabels: Record<string, string> = {
  make: "Camera Make",
  model: "Camera Model",
  lensModel: "Lens Model",
  city: "City",
  state: "State",
  country: "Country",
  projectionType: "Projection Type",
  colorspace: "Colorspace",
  bitsPerSample: "Bits Per Sample",
  rating: "Rating",
};

const filterIcons: Record<string, string> = {
  make: "📷",
  model: "📸",
  lensModel: "🔍",
  city: "🏙️",
  state: "🗺️",
  country: "🌍",
  projectionType: "🌐",
  colorspace: "🎨",
  bitsPerSample: "🔢",
  rating: "⭐",
};

export function AssetFilterDropdown({
  className,
}: AssetFilterDropdownProps) {
  const { addFilter, clearFilters, filterData, isLoadingFilters } = useAssetFilters();
  const [open, setOpen] = React.useState(false);
  const [selectedFilterType, setSelectedFilterType] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedFilterType(null);
        setInputValue("");
      }, 100);
    }
  }, []);

  const onFilterAdd = React.useCallback(
    (filterType: string, value: string | number) => {
      const newFilter = { 
        type: filterType, 
        operator: "is", // Default operator
        value 
      };
      addFilter(newFilter);
      
      setOpen(false);
      setTimeout(() => {
        setSelectedFilterType(null);
        setInputValue("");
      }, 100);
    },
    [addFilter],
  );

  const onFiltersReset = React.useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  if (isLoadingFilters) {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <Button variant="outline" size="sm" disabled>
          <ListFilter className="mr-2 h-4 w-4" />
          Loading filters...
        </Button>
      </div>
    );
  }

  const availableFilters = filterData?.filters ? Object.keys(filterData.filters) : [];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Filter Popover */}
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            aria-label="Open filter menu"
            variant="outline"
            size="sm"
            className="h-8"
          >
            <ListFilter />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-80 p-0"
        >
          <Command loop>
            <CommandInput
              placeholder={
                selectedFilterType
                  ? `Search ${filterLabels[selectedFilterType] || selectedFilterType}...`
                  : "Search filter types..."
              }
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {selectedFilterType ? (
                <>
                  <CommandEmpty>No values found.</CommandEmpty>
                  <CommandGroup>
                    {filterData?.filters[selectedFilterType]?.map((value) => (
                      <CommandItem
                        key={value}
                        value={value.toString()}
                        onSelect={() => onFilterAdd(selectedFilterType, value)}
                      >
                        <span className="truncate">{value}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : (
                <>
                  <CommandEmpty>No filter types found.</CommandEmpty>
                  <CommandGroup>
                    {availableFilters.map((filterType) => (
                      <CommandItem
                        key={filterType}
                        value={filterType}
                        onSelect={() => {
                          setSelectedFilterType(filterType);
                          setInputValue("");
                        }}
                      >
                                                 {filterIcons[filterType] && <span className="mr-2 h-4 w-4">{filterIcons[filterType]}</span>}
                        <span className="truncate">
                          {filterLabels[filterType] || filterType}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {filterData?.filters[filterType]?.length || 0}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
