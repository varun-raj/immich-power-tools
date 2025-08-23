# Virtualized Asset Grid Components

This document explains how to use the new React Window-based virtualized asset grid components for better performance with large datasets.

## Overview

The virtualized asset grid components provide significant performance improvements when displaying large numbers of assets by only rendering the items that are currently visible in the viewport. This is especially useful for photo galleries with thousands of images.

## Components

### 1. VirtualizedAssetGrid

A basic virtualized grid with fixed dimensions.

```tsx
import VirtualizedAssetGrid from '@/components/shared/VirtualizedAssetGrid';

<VirtualizedAssetGrid
  assets={assets}
  selectable={true}
  onSelectionChange={handleSelectionChange}
  columnCount={5}
  itemSize={200}
  height={600}
/>
```

**Props:**
- `assets`: Array of IAsset objects
- `selectable`: Whether assets can be selected (default: false)
- `onSelectionChange`: Callback when selection changes
- `columnCount`: Number of columns (default: 5)
- `itemSize`: Size of each item in pixels (default: 200)
- `height`: Height of the grid container (default: 600)

### 2. ResponsiveVirtualizedAssetGrid

A responsive virtualized grid that automatically adjusts to container size.

```tsx
import ResponsiveVirtualizedAssetGrid from '@/components/shared/ResponsiveVirtualizedAssetGrid';

<ResponsiveVirtualizedAssetGrid
  assets={assets}
  selectable={true}
  onSelectionChange={handleSelectionChange}
  targetItemSize={200}
  gap={8}
  minColumns={2}
  maxColumns={8}
  className="w-full h-full"
/>
```

**Props:**
- `assets`: Array of IAsset objects
- `selectable`: Whether assets can be selected (default: false)
- `onSelectionChange`: Callback when selection changes
- `targetItemSize`: Target size for each item (default: 200)
- `gap`: Gap between items in pixels (default: 8)
- `minColumns`: Minimum number of columns (default: 2)
- `maxColumns`: Maximum number of columns (default: 8)
- `className`: Additional CSS classes

## Features

### Selection
Both components support asset selection with the following features:
- Click to select/deselect individual assets
- Shift+click for range selection
- ESC key to clear all selections
- Visual indicators for selected items

### Lightbox Integration
Both components integrate with the existing lightbox for full-screen viewing:
- Click on an asset to open in lightbox
- Video support with duration display
- Download functionality

### Performance Optimizations
- Only renders visible items
- Lazy loading of images
- Efficient memory usage
- Smooth scrolling performance

## Migration from AssetGrid

To migrate from the existing `AssetGrid` component:

### Before:
```tsx
import AssetGrid from '@/components/shared/AssetGrid';

<AssetGrid
  assets={assets}
  selectable={true}
  onSelectionChange={handleSelectionChange}
/>
```

### After:
```tsx
import ResponsiveVirtualizedAssetGrid from '@/components/shared/ResponsiveVirtualizedAssetGrid';

<div style={{ height: '600px', width: '100%' }}>
  <ResponsiveVirtualizedAssetGrid
    assets={assets}
    selectable={true}
    onSelectionChange={handleSelectionChange}
    targetItemSize={200}
    gap={8}
    minColumns={2}
    maxColumns={8}
  />
</div>
```

**Important:** The virtualized components require a container with a defined height. Make sure to wrap them in a div with appropriate height styling.

## Custom Hook: useGridDimensions

The `useGridDimensions` hook can be used to calculate optimal grid dimensions:

```tsx
import { useGridDimensions } from '@/hooks';

const gridDimensions = useGridDimensions({
  containerWidth: 800,
  containerHeight: 600,
  itemSize: 200,
  gap: 8,
  minColumns: 2,
  maxColumns: 8
});
```

## Example Usage

See `src/components/shared/AssetGridExample.tsx` for a complete example showing different configurations of the virtualized grid components.

## Performance Considerations

- Use `ResponsiveVirtualizedAssetGrid` for most use cases as it automatically adapts to container size
- Set appropriate `targetItemSize` based on your design requirements
- Consider using smaller `gap` values for dense layouts
- The components work best with containers that have a defined height

## Browser Support

The components use modern browser APIs:
- ResizeObserver (for responsive behavior)
- IntersectionObserver (for lazy loading)
- CSS Grid and Flexbox

For older browsers, consider using polyfills or the basic `VirtualizedAssetGrid` with fixed dimensions.
