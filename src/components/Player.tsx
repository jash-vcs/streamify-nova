import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { servers } from "@/utils/serverUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlayerProps {
  mediaType: string;
  id: string;
  seasonNumber?: string;
  episodeNumber?: string;
}

const Player = ({ mediaType, id, seasonNumber, episodeNumber }: PlayerProps) => {
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimer, setControlsTimer] = useState<NodeJS.Timeout | null>(null);
  

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
    </div>
  );
};

export default Player;