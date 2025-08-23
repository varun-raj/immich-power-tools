import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Check, X, RotateCcw } from 'lucide-react'
import { humanizeNumber } from '@/helpers/string.helper'

interface BulkActionBarProps {
  selectedCount: number
  totalAssets: number
  onDeleteSelected: () => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onInvertSelection: () => void
  isVisible: boolean
}

export default function BulkActionBar({
  selectedCount,
  totalAssets,
  onDeleteSelected,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  isVisible
}: BulkActionBarProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {humanizeNumber(selectedCount)} of {humanizeNumber(totalAssets)} selected
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="flex items-center gap-1"
          >
            <Check size={16} />
            Select All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDeselectAll}
            className="flex items-center gap-1"
          >
            <X size={16} />
            Deselect All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onInvertSelection}
            className="flex items-center gap-1"
          >
            <RotateCcw size={16} />
            Invert
          </Button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete Selected ({selectedCount})
          </Button>
        </div>
      </div>
    </div>
  )
}
