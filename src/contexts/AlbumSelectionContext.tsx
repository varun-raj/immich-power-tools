import { createContext, useContext, useState } from "react";
import { IAlbum } from "@/types/album";

interface AlbumSelectionContextType {
  selectedAlbums: IAlbum[];
  lastSelectedId: string | null;
  selectAlbum: (album: IAlbum, albums: IAlbum[], isShiftClick?: boolean) => void;
  selectAll: (albums: IAlbum[]) => void;
  clearSelection: () => void;
}

export const AlbumSelectionContext = createContext<AlbumSelectionContextType>({
  selectedAlbums: [],
  lastSelectedId: null,
  selectAlbum: () => { },
  selectAll: () => { },
  clearSelection: () => { },
});

export const useAlbumSelection = () => {
  return useContext(AlbumSelectionContext);
};

export const AlbumSelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAlbums, setSelectedAlbums] = useState<IAlbum[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const selectAlbum = (album: IAlbum, albums: IAlbum[], isShiftClick?: boolean) => {
    setSelectedAlbums(prevSelectedAlbums => {
      let newSelectedAlbums: IAlbum[] = [];
      if (isShiftClick && lastSelectedId && lastSelectedId !== album.id) {
        const currentIndex = albums.findIndex(a => a.id === album.id);
        const lastIndex = albums.findIndex(a => a.id === lastSelectedId);
        if (currentIndex !== -1 && lastIndex !== -1) {
          const startIndex = Math.min(currentIndex, lastIndex);
          const endIndex = Math.max(currentIndex, lastIndex);
          const rangeAlbums = albums.slice(startIndex, endIndex + 1);
          // Avoid duplicate albums by id
          const uniqueIds = new Set(prevSelectedAlbums.map(a => a.id));
          newSelectedAlbums = [...prevSelectedAlbums];
          for (const alb of rangeAlbums) {
            if (!uniqueIds.has(alb.id)) {
              newSelectedAlbums.push(alb);
              uniqueIds.add(alb.id);
            }
          }
        } else {
          newSelectedAlbums = [...prevSelectedAlbums];
        }
      } else {
        // Toggle single selection
        const isAlreadySelected = prevSelectedAlbums.some(a => a.id === album.id);
        if (isAlreadySelected) {
          newSelectedAlbums = prevSelectedAlbums.filter(a => a.id !== album.id);
        } else {
          newSelectedAlbums = [...prevSelectedAlbums, album];
        }
      }
      return newSelectedAlbums;
    });
    setLastSelectedId(album.id);
  }

  const selectAll = (albums: IAlbum[]) => {
    setSelectedAlbums(albums as IAlbum[]);
  };

  const clearSelection = () => {
    setSelectedAlbums([]);
  };

  return (
    <AlbumSelectionContext.Provider value={{
      selectedAlbums,
      lastSelectedId,
      selectAlbum,
      selectAll, clearSelection
    }}> {children} </AlbumSelectionContext.Provider>
  );
};