import React, { useRef } from 'react';
import { IAsset } from '@/types/asset';
import VirtualizedAssetGrid from './VirtualizedAssetGrid';
import ResponsiveVirtualizedAssetGrid from './ResponsiveVirtualizedAssetGrid';
import { Button } from '@/components/ui/button';

interface AssetGridExampleProps {
  assets: IAsset[];
  onSelectionChange?: (ids: string[]) => void;
}

export default function AssetGridExample({ assets, onSelectionChange }: AssetGridExampleProps) {
  const gridRef = useRef<any>(null);

  const handleSelectAll = () => {
    gridRef.current?.selectAll();
  };

  const handleUnselectAll = () => {
    gridRef.current?.unselectAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleSelectAll} variant="outline" size="sm">
          Select All
        </Button>
        <Button onClick={handleUnselectAll} variant="outline" size="sm">
          Unselect All
        </Button>
      </div>

      {/* Example 1: Basic Virtualized Grid with fixed dimensions */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Fixed Size Virtualized Grid</h3>
        <div style={{ height: '600px', width: '100%' }}>
          <VirtualizedAssetGrid
            ref={gridRef}
            assets={assets}
            selectable={true}
            onSelectionChange={onSelectionChange}
            columnCount={5}
            itemSize={200}
            height={600}
          />
        </div>
      </div>

      {/* Example 2: Responsive Virtualized Grid */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Responsive Virtualized Grid</h3>
        <div style={{ height: '600px', width: '100%' }}>
          <ResponsiveVirtualizedAssetGrid
            ref={gridRef}
            assets={assets}
            selectable={true}
            onSelectionChange={onSelectionChange}
            targetItemSize={200}
            gap={8}
            minColumns={2}
            maxColumns={8}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Example 3: Responsive Grid with different target sizes */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Small Items Virtualized Grid</h3>
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveVirtualizedAssetGrid
            ref={gridRef}
            assets={assets}
            selectable={true}
            onSelectionChange={onSelectionChange}
            targetItemSize={120}
            gap={4}
            minColumns={3}
            maxColumns={12}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
