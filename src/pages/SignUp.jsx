import React, { useState } from "react";
import { createPortal } from "react-dom"; // 1. Import for rendering popup on top
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import signupBg from "../assets/signup.jpg";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

// 2. Import your Notification Popup (Adjust path if needed)
import WarningPopup from "./Warning";

export default function SignUp() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Track if the card is active/focused
  const [isCardActive, setIsCardActive] = useState(false);

  // 3. NEW STATE: For the Warning Popup
  const [notification, setNotification] = useState({
    show: false,
    type: "warning",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attempt signup
    const res = await signup({ name, email, password });

    if (res.ok) {
      navigate("/login");
    } else {
      // 4. REPLACED ALERT WITH POPUP
      // This handles "Email already exists" or any other backend error
      setNotification({
        show: true,
        type: "warning",
        message: res.error || "Signup failed. Please check your details.",
      });
    }
  };

  // Helper to close popup
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const upperWords = ["Join", "Create", "Shine"];
  const lowerLines = [
    "Build your professional identity",
    "Showcase your skills",
    "Stand out effortlessly",
  ];

  return (
    <>
      {/* 5. RENDER POPUP (Using Portal to bypass overflow-hidden) */}
      {notification.show &&
        createPortal(
          <WarningPopup
            type={notification.type}
            message={notification.message}
          />,
          document.body
        )}

      <div
        className="min-h-screen w-full flex items-center justify-start px-10 relative overflow-hidden"
        onClick={() => setIsCardActive(false)}
      >
        <p
          onClick={() => navigate("/")}
          className="absolute top-6 right-15 z-50 text-white font-light text-sm cursor-pointer hover:text-gray-300 transition-colors tracking-wide "
        >
          About
        </p>

        {/* Background Image */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform will-change-transform ${
            isCardActive ? "blur-sm scale-105" : "blur-0 scale-100"
          }`}
          style={{
            backgroundImage: `url(${signupBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Card Container */}
        <div className="relative z-50 w-full max-w-sm ml-32">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div
              className="relative p-8 rounded-2xl shadow-2xl bg-white/1 backdrop-blur-xs border border-white/2 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsCardActive(true);
              }}
            >
              <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
                Let's Build Together
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-transparent outline-none placeholder-gray-200 text-white py-3 px-4 rounded-lg border border-white/30 focus:border-white/60 transition-colors"
                    required
                    onFocus={() => setIsCardActive(true)}
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-transparent outline-none placeholder-gray-200 text-white py-3 px-4 rounded-lg border border-white/30 focus:border-white/60 transition-colors"
                    required
                    onFocus={() => setIsCardActive(true)}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent outline-none placeholder-gray-200 text-white py-3 px-4 pr-10 rounded-lg border border-white/30 focus:border-white/60 transition-colors"
                    required
                    onFocus={() => setIsCardActive(true)}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white hover:text-gray-200 z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg shadow-md hover:bg-gray-100 hover:scale-[1.02] transition-all active:scale-95"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-center text-white mt-3 text-sm font-medium">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="underline cursor-pointer font-bold hover:text-blue-100 transition-colors relative z-20"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Right Side Fancy Text */}
        <div
          className={`absolute right-20 top-1/3 max-w-lg hidden md:block transition-all duration-700 ${
            isCardActive ? "blur-sm opacity-70" : "blur-0 opacity-100"
          }`}
        >
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <Typewriter
              words={upperWords}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={500}
            />
          </h1>
          <h2 className="text-2xl md:text-3xl text-white font-semibold drop-shadow-md">
            <Typewriter
              words={lowerLines}
              loop={0}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          </h2>
        </div>
      </div>
    </>
  );
}
