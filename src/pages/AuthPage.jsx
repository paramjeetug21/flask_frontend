import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import loginBg from "../assets/loginPage.jpg";
import signupBg from "../assets/signup.jpg";
import { Typewriter } from "react-simple-typewriter";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage({ initialView = "login" }) {
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState(initialView); // "login" or "signup"

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (view === "login") {
      const res = await login({ email, password });
      if (res.ok) navigate("/dashboard");
      else alert(res.error);
    } else {
      const res = await signup({ name, email, password });
      if (res.ok) navigate("/login");
      else alert(res.error);
    }
  };

  const upperWords =
    view === "login"
      ? ["Welcome", "Back", "Professional", "Creative", "Focused"]
      : [
          "Networking",
          "Brilliance",
          "Professionalism",
          "Creativity",
          "Excellence",
        ];

  const lowerLines =
    view === "login"
      ? [
          "Log in to manage your profile",
          "Your identity, your control",
          "Fast. Secure. Reliable.",
          "Let's get you back in!",
        ]
      : [
          "Craft Your Unique Identity",
          "Showcase Your Professional Brilliance",
          "Connect, Share, Grow",
          "Your Profile, Your Story",
          "Stand Out, Effortlessly",
        ];

  const cardVariants = {
    initial: (direction) => ({ opacity: 0, x: direction > 0 ? 100 : -100 }),
    animate: { opacity: 1, x: 0 },
    exit: (direction) => ({ opacity: 0, x: direction > 0 ? -100 : 100 }),
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-start px-10 relative overflow-hidden">
      {/* Background */}

      <p
        onClick={() => navigate("/")}
        className="absolute top-6 right-15 z-50 text-white font-light text-sm cursor-pointer hover:text-gray-300 transition-colors tracking-wide "
      >
        About
      </p>

      <AnimatePresence mode="wait">
        <motion.img
          key={view}
          src={view === "login" ? loginBg : signupBg}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Card */}
      <div className="relative z-20 w-full max-w-sm ml-32 mt-12">
        <AnimatePresence
          mode="wait"
          initial={false}
          custom={view === "login" ? 1 : -1}
        >
          <motion.div
            key={view}
            custom={view === "login" ? 1 : -1}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div
              className="relative p-8 rounded-2xl shadow-xl bg-white/1 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-3xl font-bold text-white drop-shadow mb-6">
                {view === "login" ? "Welcome Back" : "Build. Connect. Grow."}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {view === "signup" && (
                  <div className="relative">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="w-full bg-transparent outline-none placeholder-gray-300 text-white py-3 px-4 rounded-lg border border-white/20"
                    />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-transparent outline-none placeholder-gray-300 text-white py-3 px-4 rounded-lg border border-white/20"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent outline-none placeholder-gray-300 text-white py-3 px-4 pr-10 rounded-lg border border-white/20"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white/90 text-black font-semibold rounded-lg shadow-md hover:bg-white transition-all"
                >
                  {loading
                    ? view === "login"
                      ? "Signing In..."
                      : "Creating..."
                    : view === "login"
                    ? "Sign In"
                    : "Sign Up"}
                </button>

                <p className="text-center text-white mt-3">
                  {view === "login"
                    ? "Don’t have an account? "
                    : "Already have an account? "}
                  <span
                    onClick={() =>
                      setView(view === "login" ? "signup" : "login")
                    }
                    className="underline cursor-pointer"
                  >
                    {view === "login" ? "Sign Up" : "Login"}
                  </span>
                </p>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Side Fancy Text */}
      <div className="absolute right-20 top-1/3 max-w-lg">
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
  );
}
