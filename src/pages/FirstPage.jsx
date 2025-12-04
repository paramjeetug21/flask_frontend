import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext"; // assuming you have auth context
import Dashboard from "./DashBoard";
import ProfileView from "./User";
import { LayoutDashboard } from "lucide-react";

export default function Layout() {
  const [activeTab, setActiveTab] = useState("dashboard"); // default tab
  const user = JSON.parse(localStorage.getItem("userData"));

  // user object from localStorage
  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    if (user.user.profile_photo) setUserPhoto(user.user.profile_photo);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="bg-[#1B2A5A] text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {activeTab === "dashboard" ? "Dashboard" : "Profile"}
        </h1>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {/* Dashboard Button */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-2 rounded-lg font-semibold flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-white text-indigo-700"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md relative group focus:outline-none transition-all ${
              activeTab === "profile" ? "ring-2 ring-indigo-400" : ""
            }`}
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold flex items-center justify-center w-full h-full">
                U
              </span>
            )}

            {/* Tooltip */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
              Profile
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto bg-gray-100">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "profile" && <ProfileView />}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 text-sm py-4 text-center">
        © {new Date().getFullYear()} | Privacy Policy • Terms • License
      </footer>
    </div>
  );
}
