
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { servers } from "@/utils/serverUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addToContinueWatching } from "@/utils/localStorageUtils";

interface PlayerProps {
  mediaType: string;
  id: string;
  seasonNumber?: string;
  episodeNumber?: string;
}

const Player = ({ mediaType, id, seasonNumber, episodeNumber }: PlayerProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedServer, setSelectedServer] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimer, setControlsTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Convert params to numbers
  const currentSeason = seasonNumber ? parseInt(seasonNumber) : 1;
  const currentEpisode = episodeNumber ? parseInt(episodeNumber) : 1;

  // Get the embed URL from the selected server
  const getEmbedUrl = () => {
    return servers[selectedServer].getter(mediaType, id, seasonNumber, episodeNumber);
  };

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimer(timer);
  };

  // Handle navigation to previous episode
  const handlePreviousEpisode = () => {
    if (mediaType !== 'tv') return;
    
    if (currentEpisode > 1) {
      // Go to previous episode in same season
      navigate(`/watch/${mediaType}/${id}/${currentSeason}/${currentEpisode - 1}`);
      toast.success(`Playing S${currentSeason}:E${currentEpisode - 1}`);
    } else if (currentSeason > 1) {
      // Go to last episode of previous season (assuming 10 episodes per season)
      navigate(`/watch/${mediaType}/${id}/${currentSeason - 1}/10`);
      toast.success(`Playing S${currentSeason - 1}:E10`);
    } else {
      toast.info("This is the first episode");
    }
  };

  // Handle navigation to next episode
  const handleNextEpisode = () => {
    if (mediaType !== 'tv') return;
    
    // Go to next episode (assuming 10 episodes per season)
    if (currentEpisode < 10) {
      navigate(`/watch/${mediaType}/${id}/${currentSeason}/${currentEpisode + 1}`);
      toast.success(`Playing S${currentSeason}:E${currentEpisode + 1}`);
    } else {
      // Go to first episode of next season
      navigate(`/watch/${mediaType}/${id}/${currentSeason + 1}/1`);
      toast.success(`Playing S${currentSeason + 1}:E1`);
    }
  };

  // Track viewing in continue watching list
  useEffect(() => {
    // Fetch movie details from API to get title and poster
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=2a5ea3b326cfeb693a6227de27c9439d&language=en-US`
        );
        const movie = await res.json();
        
        // Add to continue watching with 0 progress initially
        addToContinueWatching(
          movie,
          mediaType,
          0,
          mediaType === 'tv' ? currentSeason : undefined,
          mediaType === 'tv' ? currentEpisode : undefined
        );
      } catch (error) {
        console.error("Failed to add to continue watching:", error);
      }
    };
    
    fetchMovieDetails();
  }, [id, mediaType, seasonNumber, episodeNumber]);

  // Set up orientation and controls
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimer(initialTimer);
    
    return () => {
      if (controlsTimer) {
        clearTimeout(controlsTimer);
      }

      // Attempt to unlock orientation when component unmounts
      if (typeof screen.orientation !== 'undefined' && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
  }, []);

  return (
    <div 
      className="relative w-full h-screen bg-netflix-black"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      <div className={`absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2.5 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="w-48">
          <Select
            value={selectedServer.toString()}
            onValueChange={(value) => setSelectedServer(parseInt(value))}
          >
            <SelectTrigger className="bg-black/40 text-white border-none hover:bg-black/60">
              <SelectValue placeholder={servers[selectedServer].name} />
            </SelectTrigger>
            <SelectContent className="bg-black/90 text-white border-gray-700">
              {servers.map((server, index) => (
                <SelectItem 
                  key={index} 
                  value={index.toString()}
                  className="hover:bg-gray-800 focus:bg-gray-800 focus:text-white"
                >
                  {server.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="max-md:hidden"/>
      </div>

      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full md:w-full md:h-full border-0"
          allowFullScreen
          loading="eager"
          title="Video Player"
        ></iframe>
      </div>

      {/* Episode Navigation Controls */}
      {mediaType === 'tv' && (
        <div className={`absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="outline"
            size="lg"
            className="bg-black/40 text-white border-none hover:bg-black/60"
            onClick={handlePreviousEpisode}
          >
            <ArrowLeftCircle className="mr-2" />
            Previous Episode
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-black/40 text-white border-none hover:bg-black/60"
            onClick={handleNextEpisode}
          >
            Next Episode
            <ArrowRightCircle className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Player;
