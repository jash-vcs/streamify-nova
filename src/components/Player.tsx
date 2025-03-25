
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlayerProps {
  mediaType: string;
  id: string;
  seasonNumber?: string;
  episodeNumber?: string;
}

const Player = ({ mediaType, id, seasonNumber, episodeNumber }: PlayerProps) => {
  const navigate = useNavigate();

  let embedUrl = "";
  if (mediaType === "movie") {
    embedUrl = `https://embed.su/embed/movie/${id}`;
  } else if (mediaType === "tv" && seasonNumber && episodeNumber) {
    embedUrl = `https://embed.su/embed/tv/${id}/${seasonNumber}/${episodeNumber}`;
  } else if (mediaType === "tv") {
    embedUrl = `https://embed.su/embed/tv/${id}/1/1`; // Default to S01E01
  }

  return (
    <div className="relative w-full h-screen bg-netflix-black">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center space-x-2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2.5 transition-colors"
        aria-label="Back"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <iframe
          src={embedUrl}
          className="w-full h-full md:w-[90%] md:h-[90%] border-0"
          allowFullScreen
          loading="eager"
          title="Video Player"
        ></iframe>
      </div>
    </div>
  );
};

export default Player;
