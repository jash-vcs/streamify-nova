
import { useEffect, useState } from "react";
import { Movie, MovieResponse } from "@/types/types";
import { categories, fetchFromAPI } from "@/services/tmdb";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { toast } from "sonner";

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true);
        const data = await fetchFromAPI<MovieResponse>(categories[0].path);
        if (data.results.length > 0) {
          const filteredResults = data.results.filter(
            (movie) => movie.backdrop_path !== null
          );
          setFeaturedMovies(filteredResults);
        }
      } catch (error) {
        console.error("Error fetching featured content:", error);
        toast.error("Failed to load featured content.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      
      {!loading && featuredMovies.length > 0 && <Hero movies={featuredMovies} />}
      
      <div className="pb-20">
        {categories.slice(1,categories.length-1).map((category) => (
          <MovieRow
            key={category.id}
            title={category.title}
            path={category.path}
            isLarge={category.isLarge}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
