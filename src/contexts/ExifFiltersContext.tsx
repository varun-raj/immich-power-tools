import { createContext, useContext } from "react";

type FilterValue = string | string[] | number | number[] | undefined;

interface ExifFiltersType {
  updateContext: (key: string, value: FilterValue) => void;
  [key: string]: FilterValue | ((key: string, value: FilterValue) => void);
}

const ExifFilters = createContext<ExifFiltersType>({
  updateContext: () => {},
});

export default ExifFilters;

export const useExifFilters = () => {
  const context = useContext(ExifFilters) as ExifFiltersType;
  return context;
}