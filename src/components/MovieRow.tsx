
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/services/tmdb";
import { Movie, MovieResponse } from "@/types/types";
import MovieCard from "./MovieCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

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
        setMovies(data.results);
        setError(false);
      } catch (err) {
        console.error("Error fetching row data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [path]);

  if (loading) {
    return (
      <div className="row-container space-y-4 my-6 md:my-8">
        <h2 className="netflix-section-title pl-6">{title}</h2>
        <div className="flex space-x-4 pl-6 overflow-x-hidden hide-scrollbar">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-shrink-0 bg-gray-800 rounded-md animate-pulse-slow ${
                isLarge ? "h-80 w-52 md:h-96 md:w-64" : "h-40 w-72 md:h-44"
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
      <h2 className="netflix-section-title pl-6 opacity-90 group-hover:opacity-100 transition-opacity">{title}</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="pl-6">
          {movies.map((movie) => (
            <CarouselItem 
              key={movie.id} 
              className={`${isLarge ? 'basis-[250px] md:basis-[300px]' : 'basis-[200px] md:basis-[250px]'} transition-all duration-300`}
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
            <CarouselPrevious className="hidden md:flex left-1 h-20 w-10 rounded-r-md bg-black/30 hover:bg-black/50" />
            <CarouselNext className="hidden md:flex right-1 h-20 w-10 rounded-l-md bg-black/30 hover:bg-black/50" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default MovieRow;
