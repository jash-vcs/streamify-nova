
import { useState } from "react";
import { UserProfile, getProfiles, addProfile, deleteProfile, setActiveProfile } from "@/utils/localStorageUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, X } from "lucide-react";
import { toast } from "sonner";

const ProfileSelector = ({ onProfileSelected }: { onProfileSelected: () => void }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getProfiles());
  const [newProfileName, setNewProfileName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProfile = () => {
    if (!newProfileName.trim()) {
      toast.error("Profile name cannot be empty");
      return;
    }

    const profile = addProfile({ name: newProfileName });
    setProfiles(getProfiles());
    setNewProfileName("");
    setIsDialogOpen(false);
    toast.success(`Profile "${profile.name}" created!`);
  };

  const handleDeleteProfile = (id: string) => {
    deleteProfile(id);
    setProfiles(getProfiles());
    toast.success("Profile deleted");
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfile(id);
    onProfileSelected();
    toast.success("Profile selected");
  };

  return (
    <div className="min-h-screen bg-friends-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-12">Who's watching?</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        {profiles.map((profile) => (
          <div key={profile.id} className="relative flex flex-col items-center group">
            <button
              onClick={() => handleSelectProfile(profile.id)}
              className="w-24 h-24 bg-gray-700 rounded-md overflow-hidden hover:border-2 hover:border-white transition-all duration-200 mb-2 flex items-center justify-center"
              aria-label={`Select ${profile.name}`}
            >
              <User size={48} />
            </button>
            <span className="text-gray-300 group-hover:text-white">{profile.name}</span>
            
            <button
              onClick={() => handleDeleteProfile(profile.id)}
              className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete ${profile.name}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {profiles.length < 5 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-24 h-24 bg-gray-800 rounded-md flex items-center justify-center border-2 border-gray-600 border-dashed hover:border-gray-400 transition-all duration-200">
                <Plus size={40} className="text-gray-400" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Create Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Profile Name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  maxLength={25}
                />
                <Button onClick={handleAddProfile} className="w-full">
                  Create Profile
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;
