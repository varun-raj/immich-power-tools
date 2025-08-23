import { useState, useEffect, useCallback } from 'react';

interface UseGridDimensionsProps {
  containerWidth: number;
  containerHeight: number;
  itemSize: number;
  gap?: number;
  minColumns?: number;
  maxColumns?: number;
}

interface GridDimensions {
  columnCount: number;
  rowCount: number;
  itemSize: number;
  gap: number;
  width: number;
  height: number;
}

export const useGridDimensions = ({
  containerWidth,
  containerHeight,
  itemSize,
  gap = 8,
  minColumns = 2,
  maxColumns = 10
}: UseGridDimensionsProps): GridDimensions => {
  const [dimensions, setDimensions] = useState<GridDimensions>({
    columnCount: minColumns,
    rowCount: 0,
    itemSize,
    gap,
    width: containerWidth,
    height: containerHeight
  });

  const calculateDimensions = useCallback(() => {
    if (containerWidth <= 0) return;

    // Calculate optimal column count based on container width
    const availableWidth = containerWidth - gap; // Account for gap
    const optimalColumnCount = Math.floor(availableWidth / (itemSize + gap));
    
    // Clamp column count between min and max
    const columnCount = Math.max(minColumns, Math.min(maxColumns, optimalColumnCount));
    
    // Calculate actual item size to fit the container
    const actualItemSize = (availableWidth - (columnCount - 1) * gap) / columnCount;
    
    // Calculate total width needed
    const totalWidth = columnCount * actualItemSize + (columnCount - 1) * gap;
    
    // Calculate height (this will be updated when we know the total number of items)
    const totalHeight = containerHeight;

    setDimensions({
      columnCount,
      rowCount: 0, // Will be calculated when we have the data
      itemSize: actualItemSize,
      gap,
      width: totalWidth,
      height: totalHeight
    });
  }, [containerWidth, containerHeight, itemSize, gap, minColumns, maxColumns]);

  useEffect(() => {
    calculateDimensions();
  }, [calculateDimensions]);

  const updateRowCount = useCallback((totalItems: number) => {
    setDimensions(prev => ({
      ...prev,
      rowCount: Math.ceil(totalItems / prev.columnCount)
    }));
  }, []);

  return {
    ...dimensions,
    updateRowCount
  };
};
