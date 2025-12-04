import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ProfilePhotoUploader from "../components/ProfilePhotoUploader";
import ThemeToggle from "../components/ThemeToggle";
import { Camera, User, Mail, Lock } from "lucide-react";

export default function Signup() {
  const { signup, loading, darkMode } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("Fill all required fields");

    const res = await signup({ name, email, password, photo });
    if (res.ok) {
      alert("Signup successful! Please login.");
      navigate("/login");
    } else alert(res.error);
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
    : "bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100";

  const cardBg = darkMode
    ? "backdrop-blur-2xl bg-gray-900/70 border border-gray-700 text-white"
    : "backdrop-blur-2xl bg-white/30 border border-white/40";

  const inputClass = darkMode
    ? "w-full mt-1 px-10 py-2 rounded-lg border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-green-500 outline-none"
    : "w-full mt-1 px-10 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 outline-none bg-white/70";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-3 relative overflow-hidden ${bgGradient}`}
    >
      {/* Floating pastel blobs */}
      <div
        className={`absolute w-40 h-40 ${
          darkMode ? "bg-green-800/40" : "bg-pink-300/40"
        } blur-2xl rounded-full -top-6 -left-6`}
      ></div>
      <div
        className={`absolute w-40 h-40 ${
          darkMode ? "bg-blue-800/40" : "bg-green-300/40"
        } blur-2xl rounded-full bottom-6 right-0`}
      ></div>

      {/* Glass Card */}
      <div
        className={`${cardBg} shadow-xl p-5 rounded-2xl w-full max-w-sm relative`}
      >
        {/* Theme Toggle */}
        <div className="flex justify-end mb-2">
          <ThemeToggle />
        </div>

        {/* Photo at top center with camera overlay */}
        <div className="flex justify-center mb-4 relative">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProfilePhotoUploader
                  photo={photo}
                  setPhoto={setPhoto}
                  darkMode={darkMode}
                  isInline={false}
                />
              )}
            </div>

            {/* Camera Icon Overlay */}
            <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-1 rounded-full cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setPhoto(reader.result);
                  reader.readAsDataURL(file);
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <h1 className="text-xl font-bold text-center mb-1">Create Account</h1>
        <p className="text-center text-gray-400 mb-4">
          Start your journey with us
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-2 rounded-xl font-semibold text-md shadow-md hover:shadow-lg transition-all hover:scale-[1.02] ${
              darkMode
                ? "bg-gradient-to-r from-green-700 via-blue-700 to-pink-700 text-white"
                : "bg-gradient-to-r from-pink-400 via-sky-400 to-green-400 text-white"
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* Navigate to login */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`text-sm font-medium underline ${
                darkMode ? "text-green-400" : "text-blue-500"
              }`}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
