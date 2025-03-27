
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Movie, MovieResponse } from "@/types/types";
import { categories, fetchFromAPI } from "@/services/tmdb";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import DetailsSheet from "@/components/DetailsSheet";
import { toast } from "sonner";

const Index = () => {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Check if we have mediaType and id parameters
    if (mediaType && id) {
      setDetailsOpen(true);
    } else {
      setDetailsOpen(false);
    }
  }, [mediaType, id]);

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

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    // Update the URL without the mediaType and id parameters
    navigate("/", { replace: true });
  };

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

      <DetailsSheet 
        mediaType={mediaType} 
        id={id} 
        isOpen={detailsOpen} 
        onOpenChange={(open) => {
          if (!open) handleDetailsClose();
        }} 
      />
    </div>
  );
};

export default Index;
