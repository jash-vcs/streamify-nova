
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import MyList from "@/components/MyList";
import { getActiveProfile } from "@/utils/localStorageUtils";
import { useNavigate } from "react-router-dom";

const MyListPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has an active profile
    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      <div className="pt-24 pb-20">
        <h1 className="text-3xl font-bold px-4 md:px-8 mb-6">My List</h1>
        <MyList />
      </div>
    </div>
  );
};

export default MyListPage;
