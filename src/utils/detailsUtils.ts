
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from "./localStorageUtils";
import { MovieDetails } from "@/types/types";
import { toast } from "sonner";

export const toggleWatchlist = (movie: MovieDetails, mediaType: string): boolean => {
  const isInList = isInWatchlist(movie.id, mediaType);
  
  if (isInList) {
    removeFromWatchlist(movie.id, mediaType);
    toast.success(`Removed from My List`);
    return false;
  } else {
    addToWatchlist(movie, mediaType);
    toast.success(`Added to My List`);
    return true;
  }
};

export const formatRuntime = (minutes?: number): string => {
  if (!minutes) return "N/A";
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
