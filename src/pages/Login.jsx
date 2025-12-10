import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Import createPortal
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../assets/loginPage.jpg";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";

// 2. Import NotificationPopup
import WarningPopup from "./Warning";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State to track if the card is focused
  const [active, setActive] = useState(false);

  // 3. NEW STATE: Notification
  const [notification, setNotification] = useState({
    show: false,
    type: "warning",
    message: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });

    if (res.ok) {
      navigate("/");
    } else {
      // 4. REPLACED ALERT WITH POPUP
      setNotification({
        show: true,
        type: "warning",
        message: res.error || "Invalid credentials. Please try again.",
      });
    }
  };

  // Helper to close popup
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const upperWords = ["Welcome", "Back", "Professional", "Creative", "Focused"];
  const lowerLines = [
    "Log in to manage your profile",
    "Your identity, your control",
    "Fast. Secure. Reliable.",
    "Let's get you back in!",
  ];

  return (
    <>
      {/* 5. RENDER POPUP VIA PORTAL */}
      {notification.show &&
        createPortal(
          <WarningPopup
            type={notification.type}
            message={notification.message}
           
            onConfirm={closeNotification}
          />,
          document.body
        )}

      <div
        className="min-h-screen w-full flex items-center justify-start px-10 relative overflow-hidden"
        // Reset blur when clicking anywhere on the background
        onClick={() => setActive(false)}
      >
        <p
          onClick={() => navigate("/about")}
          className="absolute top-6 right-15 z-50 text-white font-light text-sm cursor-pointer hover:text-gray-300 transition-colors tracking-wide "
        >
          About
        </p>

        {/* Background Image */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform will-change-transform ${
            active ? "blur-sm scale-105" : "blur-0 scale-100"
          }`}
          style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25"></div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="min-h-screen ..."
        >
          <div
            className="relative z-20 w-full max-w-sm p-8 rounded-2xl shadow-xl ml-32 mt-36 bg-white/1 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setActive(true);
            }}
          >
            <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
              Welcome Back
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent outline-none placeholder-gray-300 text-white py-3 px-4 rounded-lg border border-white/20"
                  onFocus={() => setActive(true)} // Added focus handler
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent outline-none placeholder-gray-300 text-white py-3 px-4 pr-10 rounded-lg border border-white/20"
                  onFocus={() => setActive(true)} // Added focus handler
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white/90 text-black font-semibold rounded-lg shadow-md hover:bg-white transition-all"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-center text-white mt-3 text-sm font-medium">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="underline cursor-pointer font-bold hover:text-blue-100 transition-colors relative z-20"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </motion.div>

        {/* Right Side Fancy Text */}
        <div
          className={`absolute right-20 top-1/3 max-w-lg transition-all duration-700 ${
            active ? "blur-sm opacity-70" : "blur-0 opacity-100"
          }`}
        >
          {/* Upper Line - Big Words */}
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <Typewriter
              words={upperWords}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={120}
              deleteSpeed={80}
              delaySpeed={1500}
            />
          </h1>

          {/* Lower Line - Independent */}
          <h2 className="text-2xl md:text-3xl text-white font-semibold">
            <Typewriter
              words={lowerLines}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </h2>
        </div>
      </div>
    </>
  );
}
