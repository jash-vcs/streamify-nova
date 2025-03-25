
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Play } from "lucide-react";
import { Movie } from "@/types/types";
import { getImageUrl } from "@/services/tmdb";

interface HeroProps {
  movies: Movie[];
}

const Hero = ({ movies }: HeroProps) => {
  const [banner, setBanner] = useState<Movie | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setBanner(movies[randomIndex]);
    }
  }, [movies]);

  if (!banner) return null;

  const truncate = (string: string, n: number) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  const handlePlay = () => {
    const mediaType = banner.media_type || (banner.first_air_date ? "tv" : "movie");
    navigate(`/watch/${mediaType}/${banner.id}`);
  };

  const handleMoreInfo = () => {
    const mediaType = banner.media_type || (banner.first_air_date ? "tv" : "movie");
    navigate(`/details/${mediaType}/${banner.id}`);
  };

  return (
    <div className="hero relative h-[70vh] md:h-[80vh] lg:h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={getImageUrl(banner.backdrop_path)}
          alt={banner.title || banner.name}
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        <div className="absolute inset-0 netflix-gradient"></div>
        <div className="absolute top-0 h-24 w-full netflix-gradient-top"></div>
      </div>

      <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full md:w-2/3 lg:w-1/2 z-10 space-y-4">
        <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl text-white animate-slide-up">
          {banner.title || banner.name}
        </h1>
        
        <div className="flex space-x-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={handlePlay}
            className="netflix-button-primary flex items-center space-x-2 px-8"
          >
            <Play size={18} />
            <span>Play</span>
          </button>
          <button
            onClick={handleMoreInfo}
            className="netflix-button-secondary flex items-center space-x-2"
          >
            <Info size={18} />
            <span>More Info</span>
          </button>
        </div>
        
        <p className="text-white text-sm md:text-base max-w-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {truncate(banner.overview, 200)}
        </p>
      </div>
    </div>
  );
};

export default Hero;
