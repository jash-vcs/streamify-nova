
import { useParams } from "react-router-dom";
import Player from "@/components/Player";

const Watch = () => {
  const { mediaType, id, seasonNumber, episodeNumber } = useParams<{
    mediaType: string;
    id: string;
    seasonNumber?: string;
    episodeNumber?: string;
  }>();

  if (!mediaType || !id) {
    return <div>Invalid parameters</div>;
  }

  return (
    <Player
      mediaType={mediaType}
      id={id}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
    />
  );
};

export default Watch;
