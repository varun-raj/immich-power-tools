export interface AssetFilter {
  id: string;
  type: string;
  operator: string;
  value: string | number | (string | number)[];
}

export interface FilterValue {
  [key: string]: string[] | number[];
}

export interface FilterData {
  filters: FilterValue;
}

export interface FilterOperator {
  value: string;
  label: string;
} 