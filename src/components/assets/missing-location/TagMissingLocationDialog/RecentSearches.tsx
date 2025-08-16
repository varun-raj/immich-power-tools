import { Button } from "@/components/ui/button";
import { getRecentSearchesByType, RecentSearch, cn } from "@/lib/utils";
import { IPlace } from "@/types/common";
import { Clock, MapPin } from "lucide-react";
import React from "react";

interface RecentSearchesProps {
  searchType: RecentSearch['searchType'];
  onSelect: (place: IPlace) => void;
  selectedPlace?: IPlace | null;
  className?: string;
}

export default function RecentSearches({ searchType, onSelect, selectedPlace, className }: RecentSearchesProps) {
  const recentSearches = getRecentSearchesByType(searchType);

  if (recentSearches.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
      </div>
      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
        {recentSearches.map((search, index) => (
          <div
            key={`${search.name}-${search.latitude}-${search.longitude}-${index}`}
            onClick={() => onSelect({
              name: search.name,
              latitude: search.latitude,
              longitude: search.longitude
            })}
            className={cn(
              "hover:bg-zinc-200 dark:hover:bg-zinc-800 flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer border",
              {
                "bg-zinc-200 dark:bg-zinc-800 border-primary":
                  selectedPlace &&
                  selectedPlace.name === search.name &&
                  selectedPlace.latitude === search.latitude &&
                  selectedPlace.longitude === search.longitude,
              }
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <p className="text-sm line-clamp-2">{search.name}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {search.latitude.toFixed(4)}, {search.longitude.toFixed(4)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(search.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
