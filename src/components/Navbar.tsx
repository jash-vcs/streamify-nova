
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getProfiles, setActiveProfile, getActiveProfile } from "@/utils/localStorageUtils";
import { toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [profiles, setProfiles] = useState(getProfiles());
  const [activeProfile, setActiveProfileState] = useState(getActiveProfile());
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    if(window.screen.width < 800){
      setIsMobile(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSwitchProfile = (profileId: string) => {
    setActiveProfile(profileId);
    setActiveProfileState(getActiveProfile());
    toast.success("Profile switched");
    // Reload the page to refresh content based on new profile
    window.location.reload();
  };

  const goToProfiles = () => {
    navigate("/");
    // Force profile selection screen
    localStorage.removeItem("netflix-clone-active-profile");
    window.location.reload();
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-8 py-4 ${
        isScrolled ? "nav-background-scroll" : "bg-gradient-to-b from-netflix-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center space-x-6", isMobile && showSearch ? "hidden" : "")}>
          <Link to="/" className="flex items-center">
            <p className="font-black text-red-500 text-lg">NETFLIX</p>
          </Link>
          <div className="flex space-x-4">
            <Link to="/tv-shows" className="text-sm text-white hover:text-gray-300 transition">TV Shows</Link>
            <Link to="/movies" className="text-sm text-white hover:text-gray-300 transition">Movies</Link>
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
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer outline-none">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
                <User size={18} className="text-white" />
              </div>
              <ChevronDown size={16} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-netflix-black border-gray-700 text-white min-w-[200px]">
              {profiles.map(profile => (
                <DropdownMenuItem 
                  key={profile.id}
                  onClick={() => handleSwitchProfile(profile.id)}
                  className={`cursor-pointer ${profile.id === activeProfile?.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span>{profile.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                onClick={goToProfiles}
                className="cursor-pointer hover:bg-gray-800"
              >
                Manage Profiles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
