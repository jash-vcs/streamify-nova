
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchFromAPI } from "@/services/tmdb";
import { Movie, MovieResponse } from "@/types/types";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  path: string;
  isLarge?: boolean;
}

const MovieRow = ({ title, path, isLarge = false }: MovieRowProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;

    const { scrollWidth, clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.8;
    
    if (direction === "left") {
      const newScrollX = Math.max(scrollX - scrollAmount, 0);
      setScrollX(newScrollX);
      rowRef.current.scrollTo({ left: newScrollX, behavior: "smooth" });
    } else {
      const newScrollX = Math.min(scrollX + scrollAmount, scrollWidth - clientWidth);
      setScrollX(newScrollX);
      rowRef.current.scrollTo({ left: newScrollX, behavior: "smooth" });
    }
  };

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
      
      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-full bg-black/30 hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
        
        <div 
          ref={rowRef}
          className="flex space-x-2 pl-6 pr-6 overflow-x-scroll hide-scrollbar scrollbar-none transition-all duration-500 opacity-80 group-hover:opacity-100"
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              isLarge={isLarge} 
            />
          ))}
        </div>
        
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-full bg-black/30 hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
