
import { Movie } from "@/types/types";

// Types for our localStorage data
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
}

export interface WatchlistItem {
  id: number;
  mediaType: string;
  title: string;
  posterPath: string;
  addedAt: number;
}

export interface ContinueWatchingItem {
  id: number;
  mediaType: string;
  title: string;
  posterPath: string;
  lastWatchedAt: number;
  progress: number; // 0-100 percent watched
  seasonNumber?: number;
  episodeNumber?: number;
  serverId?: number; // Added server ID
}

// Keys for localStorage
const PROFILES_KEY = 'friends-clone-profiles';
const WATCHLIST_KEY = 'friends-clone-watchlist';
const CONTINUE_WATCHING_KEY = 'friends-clone-continue-watching';
const ACTIVE_PROFILE_KEY = 'friends-clone-active-profile';

// User Profiles
export const getProfiles = (): UserProfile[] => {
  const profiles = localStorage.getItem(PROFILES_KEY);
  return profiles ? JSON.parse(profiles) : [];
};

export const saveProfiles = (profiles: UserProfile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const addProfile = (profile: Omit<UserProfile, 'id' | 'isActive'>): UserProfile => {
  const profiles = getProfiles();
  const newProfile = {
    ...profile,
    id: Date.now().toString(),
    isActive: profiles.length === 0 // Make active if it's the first profile
  };
  
  saveProfiles([...profiles, newProfile]);
  return newProfile;
};

export const deleteProfile = (id: string): void => {
  const profiles = getProfiles();
  saveProfiles(profiles.filter(profile => profile.id !== id));
};

export const getActiveProfile = (): UserProfile | null => {
  const activeProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (!activeProfileId) return null;
  
  const profiles = getProfiles();
  return profiles.find(profile => profile.id === activeProfileId) || null;
};

export const setActiveProfile = (id: string): void => {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  
  // Update isActive state in profiles
  const profiles = getProfiles();
  const updatedProfiles = profiles.map(profile => ({
    ...profile,
    isActive: profile.id === id
  }));
  
  saveProfiles(updatedProfiles);
};

// Watchlist
export const getWatchlist = (): WatchlistItem[] => {
  const watchlist = localStorage.getItem(WATCHLIST_KEY);
  return watchlist ? JSON.parse(watchlist) : [];
};

export const saveWatchlist = (watchlist: WatchlistItem[]): void => {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const addToWatchlist = (movie: Movie, mediaType: string): void => {
  const watchlist = getWatchlist();
  const title = movie.title || movie.name || 'Unknown';
  
  // Check if movie is already in watchlist
  if (watchlist.some(item => item.id === movie.id && item.mediaType === mediaType)) {
    return;
  }
  
  const newItem: WatchlistItem = {
    id: movie.id,
    mediaType,
    title,
    posterPath: movie.poster_path,
    addedAt: Date.now()
  };
  
  saveWatchlist([...watchlist, newItem]);
};

export const removeFromWatchlist = (id: number, mediaType: string): void => {
  const watchlist = getWatchlist();
  saveWatchlist(watchlist.filter(item => !(item.id === id && item.mediaType === mediaType)));
};

export const isInWatchlist = (id: number, mediaType: string): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === id && item.mediaType === mediaType);
};

// Continue Watching
export const getContinueWatching = (): ContinueWatchingItem[] => {
  const continueWatching = localStorage.getItem(CONTINUE_WATCHING_KEY);
  return continueWatching ? JSON.parse(continueWatching) : [];
};

export const saveContinueWatching = (items: ContinueWatchingItem[]): void => {
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(items));
};

export const addToContinueWatching = (
  movie: Movie, 
  mediaType: string, 
  progress: number = 0, 
  seasonNumber?: number, 
  episodeNumber?: number,
  serverId?: number
): void => {
  const continueWatching = getContinueWatching();
  const title = movie.title || movie.name || 'Unknown';
  
  // Remove if already exists (will be re-added at the top)
  const filteredItems = continueWatching.filter(
    item => !(item.id === movie.id && item.mediaType === mediaType)
  );
  
  const newItem: ContinueWatchingItem = {
    id: movie.id,
    mediaType,
    title,
    posterPath: movie.poster_path,
    lastWatchedAt: Date.now(),
    progress,
    seasonNumber,
    episodeNumber,
    serverId
  };
  
  // Add to beginning of array
  const updatedItems = [newItem, ...filteredItems];
  
  // Keep only the last 15 items
  const limitedItems = updatedItems.slice(0, 15);
  
  saveContinueWatching(limitedItems);
};

export const updateContinueWatchingServer = (id: number, mediaType: string, serverId: number): void => {
  const continueWatching = getContinueWatching();
  const updatedItems = continueWatching.map(item => {
    if (item.id === id && item.mediaType === mediaType) {
      return { ...item, serverId };
    }
    return item;
  });
  
  saveContinueWatching(updatedItems);
};

export const removeFromContinueWatching = (id: number, mediaType: string): void => {
  const continueWatching = getContinueWatching();
  saveContinueWatching(continueWatching.filter(item => !(item.id === id && item.mediaType === mediaType)));
};

export const getLastWatched = (id: number, mediaType: string): ContinueWatchingItem | null => {
  const continueWatching = getContinueWatching();
  return continueWatching.find(item => item.id === id && item.mediaType === mediaType) || null;
};
