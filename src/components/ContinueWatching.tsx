
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContinueWatchingItem, getContinueWatching, removeFromContinueWatching } from "@/utils/localStorageUtils";
import { X } from "lucide-react";
import { toast } from "sonner";

const ContinueWatching = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number, mediaType: string) => {
    e.stopPropagation();
    removeFromContinueWatching(id, mediaType);
    setItems(getContinueWatching());
    toast.success("Removed from continue watching");
  };

  const handleItemClick = (item: ContinueWatchingItem) => {
    const route = item.mediaType === "tv" && item.seasonNumber && item.episodeNumber
      ? `/watch/${item.mediaType}/${item.id}/${item.seasonNumber}/${item.episodeNumber}`
      : `/watch/${item.mediaType}/${item.id}`;
    
    navigate(route);
  };

  if (items.length === 0) return null;

  return (
    <div className="px-4 md:px-8 mb-8 mt-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Continue Watching</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((item) => (
          <div 
            key={`${item.mediaType}-${item.id}`}
            className="relative group cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
              <img
                src={item.posterPath ? `https://image.tmdb.org/t/p/w500${item.posterPath}` : "/placeholder.svg"}
                alt={item.title || "Movie poster"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-2 w-full">
                  <p className="text-white text-sm truncate">{item.title || "Unknown Title"}</p>
                  {item.mediaType === "tv" && item.seasonNumber && item.episodeNumber && (
                    <p className="text-gray-300 text-xs">S{item.seasonNumber}:E{item.episodeNumber}</p>
                  )}
                  {item.serverId !== undefined && (
                    <p className="text-gray-400 text-xs">Server {item.serverId + 1}</p>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div 
                  className="h-full bg-red-600" 
                  style={{ width: `${item.progress}%` }}
                />
              </div> */}
            </div>
            
            <button
              className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleRemove(e, item.id, item.mediaType)}
              aria-label="Remove from continue watching"
            >
              <X size={16} className="text-white" />
            </button>
            
            {/* Always show title below the thumbnail */}
            {/* <div className="mt-1 px-1">
              <p className="text-white text-sm truncate">{item.title || "Unknown Title"}</p>
              {item.mediaType === "tv" && item.seasonNumber && item.episodeNumber && (
                <p className="text-gray-400 text-xs">S{item.seasonNumber}:E{item.episodeNumber}</p>
              )}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
