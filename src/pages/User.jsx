import React, { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  Camera,
  Save,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/authApi"; // Ensure this is your base URL (e.g., "http://localhost:5000")

export default function UserMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);

  // Get User Data from Local Storage
  const user = JSON.parse(localStorage.getItem("userData"))?.user;

  // Form States
  const [newName, setNewName] = useState(user?.name || "");
  const [newPhoto, setNewPhoto] = useState(
    user?.profile_photo || user?.photo || null
  );

  // --- 1. HANDLE OUTSIDE CLICK ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditing(false); // Reset edit mode on close
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 2. HANDLE FILE UPLOAD ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // --- 3. SAVE CHANGES (API CALL) ---
  const handleSaveChanges = async () => {
    if (!user?.email) {
      alert("User email not found. Please login again.");
      return;
    }

    setIsLoading(true);
    try {
      // FIX: Removed space and ensured correct path structure for Flask Blueprint
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email, // Required by backend to find user
          name: newName,
          profile_photo: newPhoto,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update Local Storage manually so UI updates immediately
        const storedData = JSON.parse(localStorage.getItem("userData"));

        // Update specific fields based on backend response or local state
        const updatedUser = {
          ...storedData,
          user: {
            ...storedData.user,
            name: newName,
            // Handle naming inconsistency (backend might return 'profile_photo' or 'photo')
            photo: newPhoto,
            profile_photo: newPhoto,
          },
        };

        localStorage.setItem("userData", JSON.stringify(updatedUser));

        // Reload to reflect changes globally
        window.location.reload();

        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper for default avatar
  const defaultPhoto =
    "https://ui-avatars.com/api/?name=" +
    (user?.name || "User") +
    "&background=random&color=fff";

  // Use either the photo from DB or profile_photo depending on how your object is structured
  const displayPhoto = user?.profile_photo || user?.photo || defaultPhoto;

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* === TRIGGER BUTTON (Avatar on Dashboard) === */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 pr-3 rounded-full transition-all duration-200 border border-transparent hover:border-gray-200"
      >
        <img
          src={displayPhoto}
          alt="User"
          className="w-9 h-9 rounded-full object-cover border border-gray-300 shadow-sm"
        />
        <div className="hidden md:flex flex-col items-start leading-none">
          <span className="text-sm font-bold text-shadow-white hover:text-gray-800">
            {user?.name?.split(" ")[0]}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">Me</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* === DROPDOWN CARD === */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          {/* --- VIEW MODE --- */}
          {!isEditing ? (
            <>
              {/* Header */}
              <div className="p-6 flex flex-col items-center text-center bg-gray-50/50 border-b border-gray-100">
                <img
                  src={displayPhoto}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-3 object-cover"
                  alt="Profile"
                />
                <h3 className="text-lg font-bold text-gray-800">
                  {user?.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {user?.email}
                </p>
              </div>

              {/* Actions */}
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <User size={18} className="text-gray-400" />
                  Edit Profile
                </button>

                <div className="h-px bg-gray-100 my-1 mx-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            /* --- EDIT MODE --- */
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold text-gray-800">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 1. Edit Photo */}
              <div className="flex justify-center mb-6">
                <div className="relative group cursor-pointer">
                  <img
                    src={newPhoto || displayPhoto}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 group-hover:opacity-50 transition-opacity"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-gray-600" />
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              {/* 2. Edit Name */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Full Name
                  </label>
                  {/* FIX: Added text-gray-900 and bg-gray-100 for better visibility */}
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <button
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
