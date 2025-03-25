
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Movie } from "@/types/types";
import { searchContent } from "@/services/tmdb";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) return;

      try {
        setLoading(true);
        const data = await searchContent(query);
        
        // Filter out results without images
        const filteredResults = data.results.filter(
          item => item.backdrop_path || item.poster_path
        );
        
        setResults(filteredResults);
      } catch (error) {
        console.error("Error performing search:", error);
        toast.error("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 md:px-16">
        <h1 className="text-2xl md:text-3xl font-medium mb-6 flex items-center">
          <SearchIcon size={24} className="mr-2" />
          Search Results: <span className="font-bold ml-2">{query}</span>
        </h1>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="aspect-video bg-gray-800 rounded-md animate-pulse-slow"
              ></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(item => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-medium mb-2">No results found</h2>
            <p className="text-gray-400">
              We couldn't find any matches for "{query}". Please try another search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
