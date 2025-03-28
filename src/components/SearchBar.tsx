
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-friends-black/90 border border-gray-700 text-white pl-10 pr-10 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-friends-red md:w-64"
          placeholder="Titles, people, genres"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white"
        aria-label="Close search"
      >
        <X size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
