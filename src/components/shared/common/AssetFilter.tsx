import { Combobox } from '@/components/ui/combobox';
import { getFilters } from '@/handlers/api/common.handler';
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query';

const fields = [
  "make",
  "model",
  "lensModel",
  "city",
  "state",
  "country",
  "projectionType",
  "colorspace",
  "bitsPerSample",
  "rating",
];

const formattedFields = fields.map(field => ({
  label: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
  value: field
}));


export default function AssetFilter() {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  
  const { data } = useQuery('filters', getFilters)


  const options = useMemo(() => {
    if (!selectedField) return formattedFields;
    const { filters } = data;

    if (!filters) return formattedFields;
    const field = filters[selectedField];
    if (!field) return [];
    return field.map((value: string) => ({
      label: value,
      value
    }));
  }, [selectedField, data]);

  return (
    <Combobox 
      options={options}
      closeOnSelect={!!selectedField}
      onSelect={(value) => {
        if (!selectedField) setSelectedField(value);
        
      }} 
      onOpenChange={(open) => {
        if (!open) setSelectedField(null);
      }}
      />
  )
}
