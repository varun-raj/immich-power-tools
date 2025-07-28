# Asset Filter Dropdown Component

A filter popover component that allows users to filter assets based on various criteria like camera make, model, location, etc.

## Features

- **Two-level filtering**: First select a filter type, then select specific values
- **Search functionality**: Search through filter types and values
- **Visual feedback**: Icons for each filter type and selected filter badges
- **Easy management**: Add, remove, and reset filters
- **Responsive design**: Adapts to different screen sizes

## Usage

```tsx
import { AssetFilterDropdown } from "@/components/assets/filters/AssetFilterDropdown";
import type { AssetFilter } from "@/types/filter";

function MyComponent() {
  const [selectedFilters, setSelectedFilters] = React.useState<AssetFilter[]>([]);

  const handleFilterChange = (filters: AssetFilter[]) => {
    setSelectedFilters(filters);
    // Apply filters to your data
  };

  return (
    <AssetFilterDropdown
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `selectedFilters` | `AssetFilter[]` | Array of currently selected filters |
| `onFilterChange` | `(filters: AssetFilter[]) => void` | Callback when filters change |
| `className` | `string?` | Optional CSS class name |

## Filter Types

The component supports the following filter types based on the API response:

- **Camera Make** (`make`) - Camera manufacturer
- **Camera Model** (`model`) - Specific camera model
- **Lens Model** (`lensModel`) - Lens used
- **City** (`city`) - City location
- **State** (`state`) - State/province location
- **Country** (`country`) - Country location
- **Projection Type** (`projectionType`) - Image projection type
- **Colorspace** (`colorspace`) - Image colorspace
- **Bits Per Sample** (`bitsPerSample`) - Color depth
- **Rating** (`rating`) - Image rating

## API Integration

The component automatically fetches available filters from the `/filters/asset-filters` endpoint using React Query. The expected response format is:

```json
{
  "filters": {
    "make": ["Canon", "Nikon", "Sony"],
    "model": ["EOS R5", "D850", "A7R IV"],
    "city": ["New York", "London", "Tokyo"],
    // ... other filter types
  }
}
```

## Styling

The component uses Tailwind CSS classes and integrates with the existing UI component library. It includes:

- Responsive design
- Dark mode support
- Consistent spacing and typography
- Accessible keyboard navigation
- Hover and focus states

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Semantic HTML structure 