
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/services/tmdb";
import { Movie, MovieResponse } from "@/types/types";
import MovieCard from "./MovieCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface MovieRowProps {
  title: string;
  path: string;
  isLarge?: boolean;
}

const MovieRow = ({ title, path, isLarge = false }: MovieRowProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchFromAPI<MovieResponse>(path);
        if (data.results.length > 0) {
          // Filter out items without images
          const filteredResults = data.results.filter(
            (movie) => isLarge ? movie.poster_path !== null : movie.backdrop_path !== null
          );
          setMovies(filteredResults);
        } else {
          setMovies([]);
          setError(true);
          toast.error("No content found for this category");
        }
        setError(false);
      } catch (err) {
        console.error("Error fetching row data:", err);
        setError(true);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [path, isLarge]);

  if (loading) {
    return (
      <div className="row-container space-y-4 my-6 md:my-8">
        <h2 className="friends-section-title pl-6">{title}</h2>
        <div className="flex space-x-4 pl-6 overflow-x-hidden hide-scrollbar">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-shrink-0 bg-gray-800 rounded-md animate-pulse ${
                isLarge ? "h-64 w-44 md:h-80 md:w-52" : "h-36 w-64 md:h-40 md:w-72"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || movies.length === 0) {
    return null;
  }

  return (
    <div className="row-container space-y-2 my-6 md:my-8 group">
      <h2 className="friends-section-title pl-6 opacity-90 group-hover:opacity-100 transition-opacity">{title}</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          containScroll: "trimSnaps",
        }}
        className="w-full px-8 max-md:px-8"
      >
        <CarouselContent className="pl-6">
          {movies.map((movie) => (
            <CarouselItem 
              key={movie.id} 
              className={`${
                isLarge 
                  ? 'basis-[160px] md:basis-[200px]' 
                  : 'basis-[240px] md:basis-[280px]'
              } transition-all duration-300 overflow-visible`}
            >
              <MovieCard 
                movie={movie} 
                isLarge={isLarge} 
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {!isMobile && (
          <>
            <CarouselPrevious className="hidden md:flex left-1 h-20 w-10 bg-transparent border-none rounded-r-md hover:bg-black/50" />
            <CarouselNext className="hidden md:flex right-1 h-20 w-10 bg-transparent border-none rounded-l-md hover:bg-black/50" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default MovieRow;
