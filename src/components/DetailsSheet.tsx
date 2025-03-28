
import { useEffect, useState } from "react";
import { MovieDetails, Season, Episode } from "@/types/types";
import { fetchMovieDetails, fetchSeasonDetails, getImageUrl } from "@/services/tmdb";
import { Play, Plus, ChevronDown, Star, Clock, Calendar, Film, Tv } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
} from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface DetailsSheetProps {
  mediaType?: string;
  id?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailsSheet = ({ mediaType, id, isOpen, onOpenChange }: DetailsSheetProps) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<{ [key: number]: Episode[] }>({});
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [seasonsMenuOpen, setSeasonsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!mediaType || !id) return;
      
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id, mediaType);
        setDetails(data);
        
        if (mediaType === "tv" && data.seasons && data.seasons.length > 0) {
          const filteredSeasons = data.seasons.filter(s => s.season_number > 0);
          setSeasons(filteredSeasons);
          if (filteredSeasons.length > 0) {
            setSelectedSeason(filteredSeasons[0].season_number);
            await loadEpisodes(id, filteredSeasons[0].season_number);
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Failed to load content details.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && id && mediaType) {
      fetchDetails();
    }
  }, [mediaType, id, isOpen]);

  const loadEpisodes = async (showId: string, seasonNumber: number) => {
    try {
      const data = await fetchSeasonDetails(showId, seasonNumber);
      setEpisodes(prev => ({
        ...prev,
        [seasonNumber]: data.episodes
      }));
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    setSeasonsMenuOpen(false);
    if (!episodes[seasonNumber] && id) {
      await loadEpisodes(id, seasonNumber);
    }
  };

  const handlePlay = () => {
    if (mediaType === "movie") {
      navigate(`/watch/movie/${id}`);
    } else if (mediaType === "tv") {
      const seasonNum = selectedSeason || 1;
      const episodeNum = episodes[seasonNum]?.[0]?.episode_number || 1;
      navigate(`/watch/tv/${id}/${seasonNum}/${episodeNum}`);
    }
    onOpenChange(false);
  };

  const handleEpisodePlay = (seasonNumber: number, episodeNumber: number) => {
    navigate(`/watch/tv/${id}/${seasonNumber}/${episodeNumber}`);
    onOpenChange(false);
  };

  const handleSimilarItemClick = (itemId: number) => {
    if (id === itemId.toString()) return;
    
    // Close and reopen with new ID to trigger effect
    onOpenChange(false);
    setTimeout(() => {
      navigate(`/details/${mediaType}/${itemId}`, { replace: true });
    }, 300);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full">
          <div className="w-full h-[30vh] animate-pulse bg-gray-800"></div>
          <div className="px-6 py-4 space-y-4">
            <div className="h-8 w-1/3 animate-pulse bg-gray-800 rounded"></div>
            <div className="h-20 animate-pulse bg-gray-800 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (!details) {
      return (
        <div className="p-6 text-center">
          <p>Content not found</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        {/* Banner Image */}
        <div className="relative h-[30vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(details.backdrop_path)}
              alt={details.title || details.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 friends-gradient"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full z-10">
            <h1 className="friends-title">
              {details.title || details.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 mr-1" />
                <span>{details.vote_average?.toFixed(1) || "N/A"}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>
                  {(details.release_date || details.first_air_date || "").substring(0, 4) || "N/A"}
                </span>
              </div>
              
              {mediaType === "movie" && details.runtime && (
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                </div>
              )}
              
              <div className="px-2 py-0.5 border border-white/30 rounded text-xs">
                {mediaType === "tv" ? "Series" : "Movie"}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handlePlay}
                className="friends-button-primary flex items-center space-x-2"
              >
                <Play size={16} />
                <span>Play</span>
              </button>
              
              <button className="friends-button-secondary flex items-center space-x-2">
                <Plus size={16} />
                <span>My List</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Details */}
        <div className="px-6 py-6 space-y-6">
          <p className="text-white/90 text-sm">{details.overview}</p>
          
          {details.genres && details.genres.length > 0 && (
            <div>
              <h3 className="text-white/70 text-sm mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {details.genres.map(genre => (
                  <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-xs">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Episodes Section for TV */}
          {mediaType === "tv" && seasons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Episodes</h2>
                <div className="relative">
                  <button 
                    className="friends-button-secondary flex items-center space-x-2 text-sm py-1"
                    onClick={() => setSeasonsMenuOpen(!seasonsMenuOpen)}
                  >
                    <span>Season {selectedSeason}</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  {seasonsMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-friends-black border border-gray-800 rounded-md shadow-xl z-20">
                      {seasons.map(season => (
                        <button
                          key={season.id}
                          onClick={() => handleSeasonChange(season.season_number)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-800 transition text-sm ${
                            selectedSeason === season.season_number ? "bg-gray-800" : ""
                          }`}
                        >
                          Season {season.season_number}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 mt-2">
                {episodes[selectedSeason] ? (
                  episodes[selectedSeason].map(episode => (
                    <div key={episode.id} className="bg-gray-900/50 rounded-md overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-36 h-24 relative">
                          {episode.still_path ? (
                            <img
                              src={getImageUrl(episode.still_path, "w300")}
                              alt={episode.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <Film size={24} className="text-gray-600" />
                            </div>
                          )}
                          <button
                            onClick={() => handleEpisodePlay(selectedSeason, episode.episode_number)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                              <Play size={16} className="text-friends-black ml-1" />
                            </div>
                          </button>
                        </div>
                        
                        <div className="p-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-sm">
                                {episode.episode_number}. {episode.name}
                              </h3>
                              <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                                <span>{episode.runtime} min</span>
                                <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleEpisodePlay(selectedSeason, episode.episode_number)}
                              className="friends-button-primary text-xs px-3 py-1 hidden sm:block"
                            >
                              Play
                            </button>
                          </div>
                          <p className="text-xs text-gray-300 mt-2 line-clamp-2">{episode.overview}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-friends-red"></div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Similar Content Section */}
          {details.similar && details.similar.results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-3">More Like This</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {details.similar.results.slice(0, 6).map(movie => (
                  <div
                    key={movie.id}
                    className="friends-card cursor-pointer"
                    onClick={() => handleSimilarItemClick(movie.id)}
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-md bg-gray-800">
                      {movie.poster_path ? (
                        <img
                          src={getImageUrl(movie.poster_path, "w342")}
                          alt={movie.title || movie.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Film size={24} className="text-gray-600" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-2 text-xs font-medium truncate">
                      {movie.title || movie.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (!isOpen) return null;

  // Use Sheet for desktop and Drawer for mobile
  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto bg-friends-black text-white">
        <DrawerHeader className="p-0">
          {renderContent()}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl p-0 overflow-y-auto bg-friends-black text-white"
      >
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
};

export default DetailsSheet;
