import React from "react";
import { useAuth } from "../context/authContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useAuth();
  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-full">
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
