import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API_URL from "../api/authApi";
import { useNavigate } from "react-router-dom";

// --- IMPORTS FOR IMAGES ---
import dashboard1 from "../assets/DashBoardPages/dashBoard1.jpg";
import dashboard2 from "../assets/DashBoardPages/dashBoard2.jpg";
import dashboard3 from "../assets/DashBoardPages/dashBoard3.jpg";

// --- IMPORTS FOR SECTIONS ---
import EducationSection from "./Education";
import ExperienceSection from "./Experience";
import ProjectsSection from "./Project";
import SkillsSection from "./Skill";
import CertificationSection from "./Certification";
import SectionList from "./Custom";
import UserProfileModal from "../pages/ProfileDashboard";
import UserMenu from "../pages/User";

// --- NEW IMPORT: The User Profile Modal ---

// ==========================================
// 1. CONFIGURATION
// ==========================================
const images = [dashboard1, dashboard2, dashboard3];

const contentItems = [
  {
    title: "WELCOME BACK",
    description:
      "Your workspace is live — let’s create impact with every move you make.",
  },
  {
    title: "MOMENT OF PRESENCE",
    description:
      "Step into your digital realm where every action shapes your journey forward.",
  },
  {
    title: "YOUR MOMENTUM",
    description:
      "Consistency fuels mastery — your progress today builds tomorrow’s success.",
  },
  {
    title: "CREATOR’S SPACE",
    description:
      "Ideas become actions here — let’s transform vision into results.",
  },
  {
    title: "PROGRESS AWAITS",
    description:
      "Everything is ready for you — take charge and move with intent.",
  },
];

const sections = [
  { key: "personal", label: "Personal Info" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "customSections", label: "Custom Sections" },
];

// ==========================================
// 2. ANIMATION VARIANTS
// ==========================================
const bgVariants = {
  initial: { opacity: 0, scale: 1.1 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1.5, ease: "easeInOut" },
    zIndex: -1,
  },
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, when: "beforeChildren" },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const characterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.1 } },
};

// ==========================================
// 3. HELPER COMPONENTS
// ==========================================
const TypingText = ({ text, className }) => {
  const characters = Array.from(text);
  return (
    <motion.p className={className} variants={textContainerVariants}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={characterVariants}
          className={char === " " ? "mr-2" : ""}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

function MinimalInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <input
        type="text"
        className="w-full py-2 border-b border-zinc-800 focus:border-zinc-400 bg-transparent outline-none font-light text-base placeholder-zinc-700 text-zinc-300 transition-colors"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function DashBoardWithToken() {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);

  // State for Create Profile Sheet (Bottom)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // State for User Modal ("Me" Button)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 30000);
    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    setShowText(true);
    const hideTimer = setTimeout(() => setShowText(false), 8000);
    const nextDataTimer = setTimeout(
      () => setTextIndex((prev) => (prev + 1) % contentItems.length),
      10000
    );
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextDataTimer);
    };
  }, [textIndex]);

  const currentContent = contentItems[textIndex];

  const handleWheel = (e) => {
    if (!isProfileOpen && !isUserModalOpen && e.deltaY > 40) {
      setIsProfileOpen(true);
    }
  };

  const handleAbout = () => {
    navigate("/about");
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onWheel={handleWheel}
    >
      <AnimatePresence>
        <motion.img
          key={imageIndex}
          src={images[imageIndex]}
          alt={`Background ${imageIndex}`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          variants={bgVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* TOP NAVIGATION */}

      {/* Change: 'items-start' -> 'items-center' to align text and icon perfectly */}
      <div className="absolute top-6 right-8 z-40 flex items-center gap-8 text-white font-light tracking-wider">
        {/* --- ME BUTTON & USER MENU WRAPPER --- */}
        <div
          className="relative group"
          onMouseEnter={() => setIsUserModalOpen(true)}
          onMouseLeave={() => setIsUserModalOpen(false)}
        >
          {/* The Trigger Button */}
          {/* Change: Removed 'pb-2' to fix alignment issues */}
          <div
            onClick={() => setIsUserModalOpen(!isUserModalOpen)}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 group-hover:scale-110 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span>Me</span>
          </div>

          {/* --- USER MENU DROPDOWN --- */}
          <AnimatePresence>
            {isUserModalOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                /* UPDATES HERE:
                   1. '-right-16': Pushes the box to the right (approx 64px). 
                      Adjust this number (-right-20, -right-10) to perfect the spot.
                   2. 'pt-6': Adds invisible padding at the top so the mouse doesn't 
                      lose focus when moving from the text to the menu.
                */
                className="absolute top-full -right-30 pt-6 w-64 z-50 origin-top-right"
              >
                {/* We wrap the UserMenu in a div to ensure the styling is contained */}
                <div className="bg-transparent">
                  <UserMenu
                    isOpen={true}
                    onClose={() => setIsUserModalOpen(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* --- END ME WRAPPER --- */}

        {/* Change: Removed 'pt-1' from both spans below so they center with flex */}
        <span
          className="cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => navigate("/portfolio")}
        >
          Portfolios
        </span>
        <span
          className="cursor-pointer hover:text-gray-300 transition-colors"
          onClick={handleAbout}
        >
          About
        </span>
      </div>

      <div className="relative z-20 h-full flex flex-col justify-center pb-32 pl-[10vw] md:pl-[15vw]">
        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              key={textIndex}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textContainerVariants}
              className="text-white text-left"
            >
              <TypingText
                text={currentContent.title}
                className="font-bold text-4xl md:text-5xl tracking-tight mb-4"
              />
              <TypingText
                text={currentContent.description}
                className="font-light text-xl md:text-2xl max-w-2xl leading-relaxed opacity-90"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- CREATE PROFILE MODAL (SLIDE UP) --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <CreateProfile
            token="YOUR_TOKEN_HERE"
            onProfileCreated={(id) => console.log("Created:", id)}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* --- USER PROFILE MODAL (OVERLAY) --- */}
      {/* This renders the modal we created in the previous step */}
      <UserMenu
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </div>
  );
}
