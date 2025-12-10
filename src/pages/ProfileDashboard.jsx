import React from "react";
import { X, LogOut, Mail, User, MapPin } from "lucide-react";
import { useAuth } from "../context/authContext"; // Assuming you have this
import { useNavigate } from "react-router-dom";

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  // Default fallback image if user has no photo
  const defaultPhoto =
    "https://www.shopfittingsstore.com.au/9262-medium_default/premium-male-mannequin-m22.jpg";

  return (
    // 1. Overlay (Backdrop)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose} // Close when clicking outside
    >
      {/* 2. Modal Card */}
      <div
        className="relative w-full max-w-sm bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 transform transition-all scale-100 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center text-center mt-4">
          {/* Photo with glowing ring */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 rounded-full"></div>
            <img
              src={user?.photo || defaultPhoto}
              alt="Profile"
              className="relative w-24 h-24 rounded-full border-4 border-[#0f172a] object-cover shadow-lg"
            />
          </div>

          {/* Name & Role */}
          <h2 className="text-2xl font-bold text-white">
            {user?.name || "User Name"}
          </h2>
          <p className="text-blue-200 text-sm font-medium mb-6">
            {user?.designation || "Member"}
          </p>

          {/* Details Box */}
          <div className="w-full bg-white/5 rounded-xl p-4 space-y-3 mb-6 border border-white/5">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail size={18} className="text-blue-400" />
              <span className="text-sm truncate">
                {user?.email || "email@example.com"}
              </span>
            </div>
            {user?.location && (
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-blue-400" />
                <span className="text-sm">{user.location}</span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-semibold rounded-xl transition-all duration-300 border border-red-500/20 group"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
