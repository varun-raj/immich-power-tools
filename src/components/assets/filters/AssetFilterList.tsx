"use client";

import * as React from "react";
import { ListFilter, Trash2, X, ChevronsUpDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAssetFilters } from "@/contexts/AssetFilterContext";
import type { AssetFilter } from "@/types/filter";

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

// Define operators for different filter types
const filterOperators: Record<string, Array<{ value: string; label: string }>> = {
  text: [
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
    { value: "contains", label: "contains" },
    { value: "doesNotContain", label: "does not contain" },
    { value: "startsWith", label: "starts with" },
    { value: "endsWith", label: "ends with" },
    { value: "isEmpty", label: "is empty" },
    { value: "isNotEmpty", label: "is not empty" },
  ],
  number: [
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
    { value: "isLessThan", label: "is less than" },
    { value: "isLessThanOrEqualTo", label: "is less than or equal to" },
    { value: "isGreaterThan", label: "is greater than" },
    { value: "isGreaterThanOrEqualTo", label: "is greater than or equal to" },
    { value: "isBetween", label: "is between" },
    { value: "isEmpty", label: "is empty" },
    { value: "isNotEmpty", label: "is not empty" },
  ],
  date: [
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
    { value: "isBefore", label: "is before" },
    { value: "isAfter", label: "is after" },
    { value: "isBetween", label: "is between" },
    { value: "isEmpty", label: "is empty" },
    { value: "isNotEmpty", label: "is not empty" },
  ],
};

// Map filter types to their operator category
const filterTypeToOperatorCategory: Record<string, string> = {
  make: "text",
  model: "text",
  lensModel: "text",
  city: "text",
  state: "text",
  country: "text",
  projectionType: "text",
  colorspace: "text",
  bitsPerSample: "number",
  rating: "number",
};

interface AssetFilterListProps {
  className?: string;
}

export function AssetFilterList({ className }: AssetFilterListProps) {
  const { filters, removeFilter, clearFilters, updateFilter, getFilterValues } = useAssetFilters();
  const [open, setOpen] = React.useState(false);

  const getOperatorsForFilter = (filterType: string) => {
    const category = filterTypeToOperatorCategory[filterType] || "text";
    return filterOperators[category] || filterOperators.text;
  };

  const getOperatorLabel = (operator: string, filterType: string) => {
    const operators = getOperatorsForFilter(filterType);
    return operators.find(op => op.value === operator)?.label || operator;
  };

  const formatFilterValue = (filter: AssetFilter) => {
    if (Array.isArray(filter.value)) {
      return `${filter.value[0]} and ${filter.value[1]}`;
    }
    return filter.value.toString();
  };

  const renderFilterInput = (filter: AssetFilter) => {
    const operators = getOperatorsForFilter(filter.type);
    const currentOperator = operators.find(op => op.value === filter.operator);
    const availableValues = getFilterValues(filter.type);

    // Debug logging
    console.log('Filter type:', filter.type);
    console.log('Available values:', availableValues);
    console.log('Available values length:', availableValues.length);

    if (currentOperator?.value === "isEmpty" || currentOperator?.value === "isNotEmpty") {
      return (
        <div className="h-8 w-16 rounded border bg-transparent px-1.5 py-0.5 text-muted-foreground">
          {currentOperator.label}
        </div>
      );
    }

    if (currentOperator?.value === "isBetween") {
      const values = Array.isArray(filter.value) ? filter.value : ["", ""];
      return (
        <div className="flex gap-1">
          <Input
            type="text"
            placeholder="Min"
            className="h-8 w-20"
            value={values[0] || ""}
            onChange={(e) => {
              const newValue = [e.target.value, values[1] || ""];
              updateFilter(filter.id, { value: newValue });
            }}
          />
          <span className="flex items-center text-muted-foreground">and</span>
          <Input
            type="text"
            placeholder="Max"
            className="h-8 w-20"
            value={values[1] || ""}
            onChange={(e) => {
              const newValue = [values[0] || "", e.target.value];
              updateFilter(filter.id, { value: newValue });
            }}
          />
        </div>
      );
    }

    // If we have available values, show a dropdown
    console.log('Checking dropdown condition:', {
      availableValuesLength: availableValues.length,
      shouldShowDropdown: availableValues.length > 0 && availableValues.length <= 100
    });
    
    // Always show dropdown for testing (temporarily)
    if (true) { // Temporarily always show dropdown for debugging
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-32 justify-between font-normal"
            >
              <span className="truncate">
                {Array.isArray(filter.value) ? "" : filter.value.toString() || "Select value..."}
              </span>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0">
            <Command>
              <CommandInput placeholder="Search values..." />
              <CommandList>
                <CommandEmpty>No values found.</CommandEmpty>
                <CommandGroup>
                  {availableValues.length > 0 ? (
                    availableValues.map((value) => (
                      <CommandItem
                        key={value}
                        value={value.toString()}
                        onSelect={() => updateFilter(filter.id, { value })}
                      >
                        <span className="truncate">{value}</span>
                        <Check
                          className={cn(
                            "ml-auto",
                            (Array.isArray(filter.value) ? "" : filter.value.toString()) === value.toString() 
                              ? "opacity-100" 
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem value="test-value" onSelect={() => updateFilter(filter.id, { value: "test-value" })}>
                      <span className="truncate">Test Value (No data loaded)</span>
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    // Fallback to regular input
    console.log('Using fallback input for filter:', filter.type);
    return (
      <Input
        type="text"
        placeholder="Enter value..."
        className="h-8 w-32"
        value={Array.isArray(filter.value) ? "" : filter.value.toString()}
        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
      />
    );
  };

  if (filters.length === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <ListFilter className="mr-2 h-4 w-4" />
              No filters applied
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">No filters applied</h4>
              <p className="text-sm text-muted-foreground">
                Add filters to refine your assets.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                Filters
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {filters.length}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Applied Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
                
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center gap-2 text-sm">
                    <span>{filterIcons[filter.type]}</span>
                    <span className="font-medium">{filterLabels[filter.type]}</span>
                    <span className="text-muted-foreground">
                      {getOperatorLabel(filter.operator, filter.type)}
                    </span>
                    <span>{formatFilterValue(filter)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2"
        >
          <Trash2 className="mr-2 h-3 w-3" />
          Clear all
        </Button>
      </div>

      {/* Filter List - Individual Filter Items */}
      <div className="flex flex-col gap-3">
        {filters.map((filter, index) => (
          <div key={filter.id} className="flex items-center gap-2 rounded-lg border p-3">
            {/* Join Operator */}
            <div className="min-w-[72px] text-center">
              {index === 0 ? (
                <span className="text-sm text-muted-foreground">Where</span>
              ) : (
                <span className="text-sm text-muted-foreground">And</span>
              )}
            </div>

            {/* Field Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-32 justify-between font-normal"
                >
                  <span className="truncate">
                    {filterIcons[filter.type]} {filterLabels[filter.type]}
                  </span>
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-0">
                <Command>
                  <CommandInput placeholder="Search fields..." />
                  <CommandList>
                    <CommandEmpty>No fields found.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(filterLabels).map(([type, label]) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={() => {
                            const operators = getOperatorsForFilter(type);
                            updateFilter(filter.id, {
                              type,
                              operator: operators[0]?.value || "is",
                              value: "",
                            });
                          }}
                        >
                          <span className="truncate">{filterIcons[type]} {label}</span>
                          <Check
                            className={cn(
                              "ml-auto",
                              type === filter.type ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Operator Selector */}
            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(filter.id, { operator: value })}
            >
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder={getOperatorLabel(filter.operator, filter.type)} />
              </SelectTrigger>
              <SelectContent>
                {getOperatorsForFilter(filter.type).map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Value Input */}
            <div className="min-w-36 flex-1">
              {renderFilterInput(filter)}
            </div>

            {/* Remove Button */}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => removeFilter(filter.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {JSON.stringify(filters)}
    </div>
  );
}
