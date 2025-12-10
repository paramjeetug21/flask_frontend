import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AboutPage from "../pages/About";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import DashBoard from "../pages/DashboardPage";
import PortfolioGallery from "../pages/Portfolio";
import ViewPortfolio from "../pages/ViewPortfolioNaturalview";
import ViewPortfolio2 from "../pages/ViewPortfoliobold";
import ViewPortfolio3 from "../pages/ViewPortfolioClassic";
import ViewPortfolio4 from "../pages/ViewPortfolioModern";

export default function AppRoutes() {
  const location = useLocation();

  // Standard Page Transition
  const pageTransition = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5 },
  };

  return (
    <AnimatePresence mode="wait">
      {/* The key={location.pathname} ensures the page re-renders on URL change */}
      <Routes location={location} key={location.pathname}>
        {/* === AUTH ROUTES === */}
        {/* Note: We removed 'initialView' prop. The component handles it. */}
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div {...pageTransition}>
              <SignUp />
            </motion.div>
          }
        />

        <Route
          path="/portfolio-natural/:id"
          element={
            <motion.div {...pageTransition}>
              <ViewPortfolio />
            </motion.div>
          }
        />
        <Route
          path="/portfolio-bold/:id"
          element={
            <motion.div {...pageTransition}>
              <ViewPortfolio2 />
            </motion.div>
          }
        />
        <Route
          path="/portfolio-classic/:id"
          element={
            <motion.div {...pageTransition}>
              <ViewPortfolio3 />
            </motion.div>
          }
        />
        <Route
          path="/portfolio-modern/:id"
          element={
            <motion.div {...pageTransition}>
              <ViewPortfolio4 />
            </motion.div>
          }
        />

        <Route
          path="/about"
          element={
            <motion.div {...pageTransition}>
              <AboutPage />
            </motion.div>
          }
        />
        <Route
          path="/"
          element={
            <motion.div {...pageTransition}>
              <DashBoard />
            </motion.div>
          }
        />
        <Route
          path="/portfolio"
          element={
            <motion.div {...pageTransition}>
              <PortfolioGallery />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
