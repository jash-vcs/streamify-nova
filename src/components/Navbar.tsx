
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
            <svg viewBox="0 0 111 30" className="h-6 md:h-8 fill-netflix-red">
              <path d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.99c-1.7-.24-3.4-.47-5.078-.69l5.53-12.92-5.53-12.91c1.8-.2 3.5-.39 5.21-.56l3.304 8.3 3.128-8.3c1.798-.2 3.598-.4 5.397-.56l-5.827 13.47zm-50.79-12.1v29.877c-1.7.2-3.4.37-5.1.53v-29.88c-1.4-.023-2.8-.035-4.2-.035v-5.21c3.8-.2 7.6-.37 11.4-.56v5.25c-0.699.016-1.4.033-2.1.033zm27.792 16.778c-.005-4.377-3.06-7.414-7.43-7.414-4.573 0-7.616 3.037-7.616 7.414 0 4.387 3.043 7.424 7.616 7.424 4.3 0 7.424-3.037 7.43-7.424zm-13.047 0c.005-3.037 2.2-5.21 5.617-5.21 3.305 0 5.508 2.185 5.513 5.21.005 3.048-2.195 5.22-5.51 5.22-3.416 0-5.615-2.173-5.62-5.22zm-8.45 1.97v-3.773c0-5.093-3.484-8.557-8.564-8.557-5.086 0-8.564 3.47-8.564 8.56v3.77c0 5.09 3.478 8.563 8.564 8.563 5.08 0 8.563-3.478 8.563-8.563zm-2.001-.01c0 3.976-2.657 6.566-6.563 6.566-3.917 0-6.562-2.59-6.562-6.567v-3.76c0-3.97 2.645-6.56 6.56-6.56 3.917 0 6.562 2.588 6.564 6.56v3.76h.001zM38.591 12.16c-1.383-.56-2.934-.82-4.55-.82-5.116 0-8.682 3.478-8.682 8.665v3.766c0 5.087 3.566 8.565 8.682 8.565 1.616 0 3.167-.27 4.55-.82v-5.18c-1.402.817-2.847 1.183-4.32 1.183-3.807 0-6.444-2.386-6.444-5.957v-1.953c.1-3.472 2.738-5.858 6.444-5.858 1.472 0 2.917.375 4.32 1.191V12.16zm33.674 10.578v-3.786c0-5.086-3.125-8.565-8.208-8.565-5.11 0-8.564 3.479-8.564 8.565v3.766c0 5.087 3.455 8.565 8.564 8.565 3.667 0 6.376-1.771 7.69-4.857l-1.506-.638c-1.068 2.302-3.13 3.478-6.183 3.478-3.567 0-6.199-2.386-6.552-5.766h14.76zm-14.752-1.983c.358-3.32 2.851-5.694 6.552-5.694 3.702 0 6.073 2.374 6.19 5.694H57.513z" />
            </svg>
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
