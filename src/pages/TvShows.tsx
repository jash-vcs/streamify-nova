
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie, MovieResponse } from "@/types/types";
import { categories, fetchFromAPI } from "@/services/tmdb";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import DetailsSheet from "@/components/DetailsSheet";
import { toast } from "sonner";

const TvShows = () => {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
  const navigate = useNavigate();
  const [featuredTvShows, setFeaturedTvShows] = useState<Movie[]>([]);
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
        // Use the TV Shows API path
        const data = await fetchFromAPI<MovieResponse>(categories[8].path);
        if (data.results.length > 0) {
          const filteredResults = data.results.filter(
            (movie) => movie.backdrop_path !== null
          );
          setFeaturedTvShows(filteredResults);
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
    navigate("/tv-shows", { replace: true });
  };

  // Get only TV related categories
  const tvCategories = categories.filter(category => 
    category.id === "netflix-originals" || 
    category.id === "tv-shows" || 
    category.path.includes("/tv")
  );

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      
      {!loading && featuredTvShows.length > 0 && <Hero movies={featuredTvShows} />}
      
      <div className="pb-20">
        {tvCategories.map((category) => (
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

export default TvShows;
