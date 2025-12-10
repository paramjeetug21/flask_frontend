import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios"; // Assuming you use axios, or use your custom fetcher

const PortfolioModern = () => {
  const { id } = useParams(); // Get the ID from URL (e.g., /portfolio-modern/123)
  const [searchParams] = useSearchParams(); // Get ?print=true
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API call
        const response = await axios.get(
          `http://localhost:5000/api/portfolio/${id}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // --- 2. PRINT LOGIC (The Magic Part) ---
  useEffect(() => {
    // Only run if data is loaded AND we are in print mode
    if (!loading && profile) {
      const isPrintMode = searchParams.get("print") === "true";

      if (isPrintMode) {
        // Wait 1000ms for images/layout to settle
        const timer = setTimeout(() => {
          window.print();

          // Optional: Cleanup (remove the iframe) after printing
          // window.frameElement?.remove();
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, profile, searchParams]);

  // --- 3. RENDER CONTENT ---
  if (loading) return <div className="p-10">Loading Profile...</div>;
  if (!profile) return <div className="p-10">Profile not found.</div>;

  return (
    // Make sure background is white for printing!
    <div
      className="min-h-screen bg-white text-black p-8 font-sans"
      id="printable-content"
    >
      {/* Example Content - Replace with your real design */}
      <header className="border-b-2 border-gray-800 pb-4 mb-8">
        <h1 className="text-4xl font-bold uppercase">{profile.name}</h1>
        <p className="text-xl text-gray-600">{profile.role}</p>
        <p className="text-sm mt-2">
          {profile.email} | {profile.phone}
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-2">About Me</h2>
        <p className="leading-relaxed">{profile.about}</p>
      </section>

      {/* Add your skills, projects, etc. here */}
    </div>
  );
};

export default PortfolioModern;
