
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Play, Volume2, VolumeX } from "lucide-react";
import { Movie, MovieDetails } from "@/types/types";
import { getImageUrl, fetchMovieDetails } from "@/services/tmdb";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface HeroProps {
  movies: Movie[];
}

const Hero = ({ movies }: HeroProps) => {
  const [banner, setBanner] = useState<Movie | null>(null);
  const [bannerDetails, setBannerDetails] = useState<MovieDetails | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();
  const videoTimeoutRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (movies.length > 0) {
      // Set initial banner
      const randomIndex = Math.floor(Math.random() * movies.length);
      setBanner(movies[randomIndex]);
    }
  }, [movies]);

  useEffect(() => {
    // Reset video timer when banner changes
    if (videoTimeoutRef.current) {
      window.clearTimeout(videoTimeoutRef.current);
    }
    
    setShowVideo(false);
    
    if (banner) {
      // Fetch movie details to get video info
      const fetchDetails = async () => {
        try {
          const mediaType = banner.media_type || (banner.first_air_date ? "tv" : "movie");
          const details = await fetchMovieDetails(banner.id.toString(), mediaType);
          setBannerDetails(details);
          
          // Set timer to show video after 5 seconds
          if (details.videos?.results?.length > 0) {
            videoTimeoutRef.current = window.setTimeout(() => {
              setShowVideo(true);
            }, 5000);
          }
        } catch (error) {
          console.error("Error fetching banner details:", error);
        }
      };
      
      fetchDetails();
    }
    
    return () => {
      if (videoTimeoutRef.current) {
        window.clearTimeout(videoTimeoutRef.current);
      }
    };
  }, [banner]);

  const handleCarouselChange = (index: number) => {
    if (movies[index]) {
      setBanner(movies[index]);
    }
  };

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
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('tv-shows')) {
      navigate(`/tv-shows/details/${mediaType}/${banner.id}`);
    } else if (currentPath.includes('movies')) {
      navigate(`/movies/details/${mediaType}/${banner.id}`);
    } else {
      navigate(`/details/${mediaType}/${banner.id}`);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  // Find a YouTube video if available
  const trailer = bannerDetails?.videos?.results?.find(
    (video) => video.type === "Trailer" || video.type === "Teaser"
  );

  return (
    <Carousel className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] w-full overflow-hidden" onValueChange={handleCarouselChange}>
      <CarouselContent>
        {movies.map((movie, index) => (
          <CarouselItem key={movie.id} className="pl-0">
            <div className={`hero relative h-[70vh] md:h-[80vh] lg:h-[90vh] w-full overflow-hidden ${
              banner.id === movie.id ? "opacity-100" : "opacity-0"
            }`}>
              <div className="absolute inset-0 w-full h-full">
                {showVideo && trailer && banner.id === movie.id ? (
                  <>
                    <div className="absolute inset-0 w-full h-full z-0">
                      <iframe
                        title="trailer"
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&loop=1&playlist=${trailer.key}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        className="w-full h-full object-cover scale-[1.5]"
                      ></iframe>
                    </div>
                    <button 
                      onClick={toggleMute}
                      className="absolute bottom-32 right-6 z-20 bg-black/50 p-2 rounded-full"
                    >
                      {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </>
                ) : (
                  <img
                    src={getImageUrl(movie.backdrop_path)}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                )}
                <div className="absolute inset-0 netflix-gradient"></div>
                <div className="absolute top-0 h-24 w-full netflix-gradient-top"></div>
              </div>

              {banner.id === movie.id && (
                <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full md:w-2/3 lg:w-1/2 z-10 space-y-4">
                  <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl text-white animate-slide-up">
                    {movie.title || movie.name}
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
                    {truncate(movie.overview, 200)}
                  </p>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Hero;
