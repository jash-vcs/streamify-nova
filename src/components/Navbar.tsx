
import { Search, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-8 py-4 ${
        isScrolled ? "nav-background-scroll" : "bg-gradient-to-b from-netflix-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center">
            <p className="font-black text-red-500 text-lg">NETFLIX</p>
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-sm text-white hover:text-gray-300 transition">Home</Link>
            <Link to="/tv-shows" className="text-sm text-white hover:text-gray-300 transition">TV Shows</Link>
            <Link to="/movies" className="text-sm text-white hover:text-gray-300 transition">Movies</Link>
            <Link to="/latest" className="text-sm text-white hover:text-gray-300 transition">New & Popular</Link>
            <Link to="/my-list" className="text-sm text-white hover:text-gray-300 transition">My List</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch ? (
            <div className="animate-fade-in">
              <SearchBar onClose={toggleSearch} />
            </div>
          ) : (
            <button
              onClick={toggleSearch}
              className="text-white hover:text-gray-300 transition"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
          <button
            className="text-white hover:text-gray-300 transition hidden md:block"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
