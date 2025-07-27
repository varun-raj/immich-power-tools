import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Recent searches localStorage utilities
export const RECENT_SEARCHES_KEY = 'immich-recent-location-searches';
export const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch {
  name: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  searchType: 'osm' | 'immich' | 'latlong' | 'map';
}

export const getRecentSearches = (): RecentSearch[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recent searches from localStorage:', error);
    return [];
  }
};

export const addRecentSearch = (place: { name: string; latitude: number; longitude: number }, searchType: RecentSearch['searchType']): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const recentSearches = getRecentSearches();
    const newSearch: RecentSearch = {
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      timestamp: Date.now(),
      searchType
    };
    
    // Remove duplicate if exists
    const filteredSearches = recentSearches.filter(
      search => !(search.name === place.name && 
                  search.latitude === place.latitude && 
                  search.longitude === place.longitude)
    );
    
    // Add new search at the beginning
    const updatedSearches = [newSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error('Error saving recent search to localStorage:', error);
  }
};

export const getRecentSearchesByType = (searchType: RecentSearch['searchType']): RecentSearch[] => {
  const allSearches = getRecentSearches();
  return allSearches.filter(search => search.searchType === searchType);
};
