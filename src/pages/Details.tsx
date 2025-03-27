
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MovieDetails, Season, Episode } from "@/types/types";
import { fetchMovieDetails, fetchSeasonDetails, getImageUrl } from "@/services/tmdb";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import { Play, Plus, ChevronDown, Star, Clock, Calendar, Film, Tv, Award, User } from "lucide-react";
import { toast } from "sonner";

const Details = () => {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<{ [key: number]: Episode[] }>({});
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

    fetchDetails();
  }, [mediaType, id]);

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
  };

  const handleEpisodePlay = (seasonNumber: number, episodeNumber: number) => {
    navigate(`/watch/tv/${id}/${seasonNumber}/${episodeNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="w-full h-[70vh] animate-pulse bg-gray-800"></div>
        <div className="px-6 md:px-16 mt-8 space-y-6">
          <div className="h-10 w-1/3 animate-pulse bg-gray-800 rounded"></div>
          <div className="h-24 animate-pulse bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!details) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      
      <div className="relative">
        {/* Banner Image */}
        <div className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(details.backdrop_path)}
              alt={details.title || details.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 netflix-gradient"></div>
            <div className="absolute top-0 h-32 w-full netflix-gradient-top"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full md:w-3/4 z-10 space-y-6">
            <h1 className="netflix-title animate-slide-up">
              {details.title || details.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span>{details.vote_average.toFixed(1)}/10</span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>
                  {(details.release_date || details.first_air_date || "").substring(0, 4)}
                </span>
              </div>
              
              {mediaType === "movie" && details.runtime && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                </div>
              )}
              
              {mediaType === "tv" && (
                <div className="flex items-center">
                  <Tv size={16} className="mr-1" />
                  <span>{details.number_of_seasons} {details.number_of_seasons === 1 ? "Season" : "Seasons"}</span>
                </div>
              )}
              
              <div className="px-2 py-0.5 border border-white/30 rounded text-xs">
                {mediaType === "tv" ? "Series" : "Movie"}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <button
                onClick={handlePlay}
                className="netflix-button-primary flex items-center space-x-2 px-8"
              >
                <Play size={18} />
                <span>Play</span>
              </button>
              
              <button className="netflix-button-secondary flex items-center space-x-2">
                <Plus size={18} />
                <span>My List</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Details */}
        <div className="px-6 md:px-16 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <p className="text-white/90 text-base">{details.overview}</p>
              
              {details.genres && details.genres.length > 0 && (
                <div>
                  <h3 className="text-white/70 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map(genre => (
                      <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {details.created_by && details.created_by.length > 0 && (
                <div>
                  <h3 className="text-white/70 mb-1">Created By</h3>
                  <p>{details.created_by.map(creator => creator.name).join(", ")}</p>
                </div>
              )}
              
              {details.production_companies && details.production_companies.length > 0 && (
                <div>
                  <h3 className="text-white/70 mb-1">Production</h3>
                  <p>{details.production_companies.slice(0, 2).map(company => company.name).join(", ")}</p>
                </div>
              )}
              
              {mediaType === "movie" && (
                <div className="flex items-center space-x-2">
                  <Film size={16} className="text-netflix-red" />
                  <span>Movie</span>
                </div>
              )}
              
              {mediaType === "tv" && (
                <div className="flex items-center space-x-2">
                  <Tv size={16} className="text-netflix-red" />
                  <span>TV Series</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Cast Section */}
          {details.credits && details.credits.cast && details.credits.cast.length > 0 && (
            <div className="space-y-4">
              <h2 className="netflix-section-title">Cast</h2>
              <div className="flex space-x-4 overflow-x-auto scrollbar-none pb-4">
                {details.credits.cast.slice(0, 10).map(person => (
                  <div key={person.id} className="flex-shrink-0 w-28">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-800 mb-2">
                      {person.profile_path ? (
                        <img
                          src={getImageUrl(person.profile_path, "w185")}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <User size={32} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-center truncate">{person.name}</p>
                    <p className="text-xs text-gray-400 text-center truncate">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Episodes Section for TV */}
          {mediaType === "tv" && seasons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="netflix-section-title">Episodes</h2>
                <div className="relative group">
                  <button className="netflix-button-secondary flex items-center space-x-2">
                    <span>Season {selectedSeason}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-netflix-black border border-gray-800 rounded-md shadow-xl z-20 hidden group-hover:block">
                    {seasons.map(season => (
                      <button
                        key={season.id}
                        onClick={() => handleSeasonChange(season.season_number)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-800 transition ${
                          selectedSeason === season.season_number ? "bg-gray-800" : ""
                        }`}
                      >
                        Season {season.season_number}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                {episodes[selectedSeason] ? (
                  episodes[selectedSeason].map(episode => (
                    <div key={episode.id} className="bg-gray-900/50 rounded-md overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 h-40 relative">
                          {episode.still_path ? (
                            <img
                              src={getImageUrl(episode.still_path, "w300")}
                              alt={episode.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <Film size={32} className="text-gray-600" />
                            </div>
                          )}
                          <button
                            onClick={() => handleEpisodePlay(selectedSeason, episode.episode_number)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play size={20} className="text-netflix-black ml-1" />
                            </div>
                          </button>
                        </div>
                        
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {episode.episode_number}. {episode.name}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                                <span>{episode.runtime} min</span>
                                <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleEpisodePlay(selectedSeason, episode.episode_number)}
                              className="netflix-button-primary text-sm hidden md:block"
                            >
                              Play
                            </button>
                          </div>
                          <p className="text-sm text-gray-300 mt-2 line-clamp-2">{episode.overview}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Similar Content Section */}
          {details.similar && details.similar.results.length > 0 && (
            <div className="mt-8">
              <h2 className="netflix-section-title">More Like This</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {details.similar.results.slice(0, 10).map(movie => (
                  <div
                    key={movie.id}
                    className="netflix-card cursor-pointer"
                    onClick={() => navigate(`/details/${mediaType}/${movie.id}`)}
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-md bg-gray-800">
                      <img
                        src={getImageUrl(movie.poster_path, "w342")}
                        alt={movie.title || movie.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-medium truncate">
                      {movie.title || movie.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
