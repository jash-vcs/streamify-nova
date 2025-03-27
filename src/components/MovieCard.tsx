
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Play, Star, Clock } from "lucide-react";
import { Movie } from "@/types/types";
import { getImageUrl } from "@/services/tmdb";

interface MovieCardProps {
  movie: Movie;
  isLarge?: boolean;
}

const MovieCard = ({ movie, isLarge = false }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const title = movie.title || movie.name || "";
  const imagePath = isLarge ? movie.poster_path : movie.backdrop_path;
  
  if (!imagePath) return null;
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${mediaType}/${movie.id}`);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/details/${mediaType}/${movie.id}`);
  };

  const handleCardClick = () => {
    navigate(`/details/${mediaType}/${movie.id}`);
  };

  return (
    <div
      className={`netflix-card cursor-pointer ${isLarge ? "w-full aspect-[2/3]" : "w-full aspect-video"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="overflow-hidden rounded-md bg-gray-800 w-full h-full">
        <img
          src={getImageUrl(imagePath, isLarge ? "w500" : "w780")}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-300 ease-in-out ${
            isHovered ? "scale-110 brightness-75" : ""
          } blur-up ${imageLoaded ? "loaded" : ""}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>

      {isHovered && (
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-md animate-fade-in">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button 
                  onClick={handlePlayClick}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                  aria-label="Play"
                >
                  <Play size={16} className="text-netflix-black ml-0.5" />
                </button>
                <button 
                  onClick={handleInfoClick}
                  className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center hover:bg-gray-600/80 transition-colors"
                  aria-label="More info"
                >
                  <Info size={16} className="text-white" />
                </button>
              </div>
              
              <div className="flex items-center space-x-1 text-xs">
                <Star size={14} className="text-yellow-400" />
                <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
              </div>
            </div>
            
            <h3 className="text-sm font-medium truncate">{title}</h3>
            
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <span>{(movie.release_date || movie.first_air_date || "").substring(0, 4) || "N/A"}</span>
              {mediaType === "tv" && <span className="px-1 py-0.5 bg-netflix-red/90 rounded text-white">Series</span>}
              {mediaType === "movie" && <span className="flex items-center"><Clock size={12} className="mr-1" />{movie.runtime || 90}m</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
