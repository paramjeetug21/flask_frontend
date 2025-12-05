import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import ThemeToggle from "../components/ThemeToggle";
import { Mail, Lock } from "lucide-react"; // Icons

export default function Login() {
  const { login, loading, darkMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.ok) {
      alert("Login Successful");
      navigate("/");
    } else alert(res.error);
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
    : "bg-gradient-to-br from-pink-100 via-blue-100 to-yellow-100";

  const cardBg = darkMode
    ? "backdrop-blur-2xl bg-gray-900/70 border border-gray-700 text-white shadow-xl"
    : "backdrop-blur-2xl bg-white/30 border border-white/40 shadow-xl";

  const inputClass = darkMode
    ? "w-full mt-1 px-10 py-2 rounded-xl border border-gray-700 bg-gray-800/70 text-white focus:ring-2 focus:ring-green-500 outline-none"
    : "w-full mt-1 px-10 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 outline-none bg-white/70";

  const buttonClass = darkMode
    ? "w-full py-3 mt-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-green-700 via-blue-700 to-pink-700 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
    : "w-full py-3 mt-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-pink-400 via-sky-400 to-green-400 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${bgGradient}`}
    >
      {/* Floating pastel blobs */}
      <div className="absolute w-52 h-52 rounded-full blur-2xl bg-pink-300/40 -top-6 -left-6 animate-pulse"></div>
      <div className="absolute w-52 h-52 rounded-full blur-2xl bg-green-300/40 bottom-6 right-0 animate-pulse delay-150"></div>
      <div className="absolute w-52 h-52 rounded-full blur-2xl bg-sky-300/40 top-1/2 left-1/3 animate-pulse delay-300"></div>

      {/* Glass Card */}
      <div className={`${cardBg} p-8 rounded-2xl w-full max-w-sm relative`}>
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* User Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            <span>👤</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 text-purple-800">
          Welcome Back
        </h1>
        <p
          className={`text-center mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={inputClass}
              required
            />
          </div>

          {/* Password */}
          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClass}
              required
            />
            <span
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Button */}
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Signup Link */}
        <p
          className={`text-center mt-4 text-sm ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className={
              darkMode
                ? "text-pink-400 font-medium"
                : "text-blue-500 font-medium"
            }
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
