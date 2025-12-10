import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundMarquee from "../components/BackgroundMarquee";

// Make sure these paths match your folder structure exactly
import creative from "../assets/serviceAssets/creativeprofile.png";
import coder from "../assets/serviceAssets/coder.jpg";
import DashBoardWithoutToken from "../components/DashBoardWithoutLogic";
export default function LandingPage() {
  const token = localStorage.getItem("token");

  return (
    <>
      {token ? <h1>Please log in to continue.</h1> : <DashBoardWithoutToken />}
    </>
  );
}
