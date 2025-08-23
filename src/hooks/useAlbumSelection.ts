import { useState, useCallback } from 'react'
import { IAlbum } from '@/types/album'

/**
 * Custom hook for album selection with shift-click support
 * @param albums - Array of albums to manage selection for
 * @returns Selection state and methods
 */
export const useAlbumSelection = (albums: IAlbum[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null)

  const selectAlbum = useCallback((albumId: string, isShiftClick: boolean = false) => {
    if (isShiftClick && lastSelectedId && lastSelectedId !== albumId) {
      // Handle shift-click range selection
      const currentIndex = albums.findIndex(album => album.id === albumId)
      const lastIndex = albums.findIndex(album => album.id === lastSelectedId)
      
      if (currentIndex !== -1 && lastIndex !== -1) {
        const startIndex = Math.min(currentIndex, lastIndex)
        const endIndex = Math.max(currentIndex, lastIndex)
        
        const newSelectedIds = new Set(selectedIds)
        for (let i = startIndex; i <= endIndex; i++) {
          newSelectedIds.add(albums[i].id)
        }
        setSelectedIds(newSelectedIds)
      }
    } else {
      // Toggle single selection
      const newSelectedIds = new Set(selectedIds)
      if (newSelectedIds.has(albumId)) {
        newSelectedIds.delete(albumId)
      } else {
        newSelectedIds.add(albumId)
      }
      setSelectedIds(newSelectedIds)
    }
    
    setLastSelectedId(albumId)
  }, [albums, selectedIds, lastSelectedId])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(albums.map(album => album.id)))
  }, [albums])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setLastSelectedId(null)
  }, [])

  const isSelected = useCallback((albumId: string) => selectedIds.has(albumId), [selectedIds])
  
  const selectedCount = selectedIds.size
  const isAllSelected = albums.length > 0 && selectedCount === albums.length
  const isPartiallySelected = selectedCount > 0 && selectedCount < albums.length

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount,
    isSelected,
    selectAlbum,
    selectAll,
    clearSelection,
    isAllSelected,
    isPartiallySelected
  }
} 