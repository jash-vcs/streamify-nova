
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WatchlistItem, getWatchlist, removeFromWatchlist } from "@/utils/localStorageUtils";
import { X } from "lucide-react";
import { toast } from "sonner";

const MyList = () => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getWatchlist());
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number, mediaType: string) => {
    e.stopPropagation();
    removeFromWatchlist(id, mediaType);
    setItems(getWatchlist());
    toast.success("Removed from My List");
  };

  const handleItemClick = (item: WatchlistItem) => {
    navigate(`/details/${item.mediaType || "movie"}/${item.id}`);
  };

  if (items.length === 0) return null;

  return (
    <div className="px-4 md:px-8 mb-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">My List</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((item) => (
          <div 
            key={`${item.mediaType}-${item.id}`}
            className="relative group cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-2 w-full">
                  <p className="text-white text-sm truncate">{item.title}</p>
                </div>
              </div>
            </div>
            
            <button
              className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => handleRemove(e, item.id, item.mediaType)}
              aria-label="Remove from My List"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyList;
