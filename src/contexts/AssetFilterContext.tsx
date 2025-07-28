"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getFilters } from "@/handlers/api/common.handler";
import type { AssetFilter, FilterData } from "@/types/filter";

interface AssetFilterContextType {
  filters: AssetFilter[];
  filterData: FilterData | undefined;
  isLoadingFilters: boolean;
  addFilter: (filter: Omit<AssetFilter, 'id'>) => void;
  removeFilter: (filterId: string) => void;
  updateFilter: (filterId: string, updates: Partial<Omit<AssetFilter, 'id'>>) => void;
  clearFilters: () => void;
  hasFilter: (filterType: string, value: string | number) => boolean;
  getFiltersByType: (filterType: string) => AssetFilter[];
  getFilterValues: (filterType: string) => (string | number)[];
}

const AssetFilterContext = React.createContext<AssetFilterContextType | undefined>(undefined);

interface AssetFilterProviderProps {
  children: React.ReactNode;
  initialFilters?: AssetFilter[];
}

export function AssetFilterProvider({ 
  children, 
  initialFilters = [] 
}: AssetFilterProviderProps) {
  const [filters, setFilters] = React.useState<AssetFilter[]>(initialFilters);

  // Fetch filter data
  const { data: filterData, isLoading: isLoadingFilters } = useQuery<FilterData>({
    queryKey: ["filters"],
    queryFn: getFilters,
  });

  // Debug logging
  console.log('Filter data loaded:', filterData);
  console.log('Is loading filters:', isLoadingFilters);

  const addFilter = React.useCallback((filter: Omit<AssetFilter, 'id'>) => {
    const newFilter: AssetFilter = {
      ...filter,
      id: Math.random().toString(36).substr(2, 9), // Generate unique ID
    };
    setFilters(prev => {
      // Check if filter already exists
      const exists = prev.some(
        f => f.type === filter.type && f.operator === filter.operator && 
             JSON.stringify(f.value) === JSON.stringify(filter.value)
      );
      if (exists) return prev;
      return [...prev, newFilter];
    });
  }, []);

  const removeFilter = React.useCallback((filterId: string) => {
    setFilters(prev => 
      prev.filter(f => f.id !== filterId)
    );
  }, []);

  const updateFilter = React.useCallback((
    filterId: string, 
    updates: Partial<Omit<AssetFilter, 'id'>>
  ) => {
    setFilters(prev => 
      prev.map(f => 
        f.id === filterId 
          ? { ...f, ...updates }
          : f
      )
    );
  }, []);

  const clearFilters = React.useCallback(() => {
    setFilters([]);
  }, []);

  const hasFilter = React.useCallback((filterType: string, value: string | number) => {
    return filters.some(f => f.type === filterType && 
      (Array.isArray(f.value) ? f.value.includes(value) : f.value === value));
  }, [filters]);

  const getFiltersByType = React.useCallback((filterType: string) => {
    return filters.filter(f => f.type === filterType);
  }, [filters]);

  const getFilterValues = React.useCallback((filterType: string) => {
    const values = filterData?.filters[filterType] || [];
    console.log('getFilterValues called for:', filterType, 'returning:', values);
    return values;
  }, [filterData]);

  const value = React.useMemo(() => ({
    filters,
    filterData,
    isLoadingFilters,
    addFilter,
    removeFilter,
    updateFilter,
    clearFilters,
    hasFilter,
    getFiltersByType,
    getFilterValues,
  }), [filters, filterData, isLoadingFilters, addFilter, removeFilter, updateFilter, clearFilters, hasFilter, getFiltersByType, getFilterValues]);

  return (
    <AssetFilterContext.Provider value={value}>
      {children}
    </AssetFilterContext.Provider>
  );
}

export function useAssetFilters() {
  const context = React.useContext(AssetFilterContext);
  if (context === undefined) {
    throw new Error("useAssetFilters must be used within an AssetFilterProvider");
  }
  return context;
}
