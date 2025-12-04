import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import Dashboard from "../pages/DashBoard";
import PortfolioPage from "../pages/ProfileDashboard";
import ProfileView from "../pages/User";
import Layout from "../pages/FirstPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user-profile" element={<ProfileView />} />

      <Route path="/portfolio/:id" element={<PortfolioPage />} />
    </Routes>
  );
}
