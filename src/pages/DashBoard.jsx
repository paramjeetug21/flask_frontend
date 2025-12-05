import { useEffect, useState } from "react";
import API_URL, { fetchDashboard } from "../api/authApi";
import Loader from "../components/Loader";
import axios from "axios";
import EducationSection from "../components/Education";
import ExperienceSection from "../components/Experience";
import ProjectsSection from "../components/Project";
import SkillsSection from "../components/Skill";
import CertificationSection from "../components/Certification";
import CreateProfile from "../components/CreatProfile";
import { useNavigate } from "react-router-dom";
import SectionList from "../components/Custom";
import {
  Linkedin,
  Twitter,
  Facebook,
  Copy,
  DeleteIcon,
  Trash2Icon,
  Trash2,
  Share2Icon,
} from "lucide-react";
import { Eye } from "lucide-react";

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [showShareModal, setShowShareModal] = useState(false);
  const [deleteProfileId, setDeleteProfileId] = useState(null);
  const [shareProfile, setShareProfile] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiUrl = API_URL;
  useEffect(() => {
    if (!token) return;

    async function loadProfiles() {
      try {
        const res = await fetchDashboard(token);
        setProfiles(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [token]);

  if (loading) return <Loader size={120} />;

  const sections = [
    { key: "personal", label: "Personal Info" },
    { key: "education", label: "Education" },
    { key: "experience", label: "Experience" },
    { key: "projects", label: "Projects" },
    { key: "skills", label: "Skills" },
    { key: "certifications", label: "Certifications" },
    { key: "customSections", label: "Custom Sections" },
  ];

  const filteredProfiles = profiles.filter((profile) => {
    const text = searchTerm.toLowerCase();
    return (
      (profile.personal?.name || "").toLowerCase().includes(text) ||
      (profile.personal?.email || "").toLowerCase().includes(text) ||
      (profile.personal?.phone || "").toLowerCase().includes(text)
    );
  });

  return (
    <div
      className="min-h-screen p-8 bg-radial from-[#0A0F2C] via-[#1B2A5A] to-black

"
    >
      <div className="max-w-7xl mx-auto">
        {/* TOP BAR: SEARCH + CREATE */}
        <div className="mb-10 flex items-center justify-between">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search your profile by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-amber-100 border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-6 px-6 py-3 bg-green-500 text-white rounded-xl 
              hover:bg-green-600 shadow-lg"
          >
            + Create New Profile
          </button>
        </div>

        {showCreateModal && (
          <CreateProfile
            token={token}
            onClose={() => setShowCreateModal(false)}
            onProfileCreated={async (newId) => {
              try {
                const res = await axios.get(`${API_URL}profile/${newId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setProfiles((prev) => [...prev, res.data]);
                setSelectedProfile(res.data); // optionally select new profile immediately
                setShowCreateModal(false);
              } catch (err) {
                console.error("Error fetching new profile:", err);
              }
            }}
          />
        )}

        {/* PROFILE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProfiles.map((profile) => (
            <div
              key={profile._id}
              className="relative cursor-pointer p-8 bg-amber-50/80 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
              onClick={() => {
                setSelectedProfile(profile);
                setActiveSection("personal");
              }}
            >
              {/* PROFILE INFO */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-300 shadow-md hover:scale-110 transition-all">
                  <img
                    src={
                      profile.personal?.photo ||
                      "https://www.shopfittingsstore.com.au/9262-medium_default/premium-male-mannequin-m22.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-800 mb-1">
                    {profile.personal?.name || "No Name"}
                  </h3>
                  <p className="text-sm font-semibold text-amber-700">
                    {profile.personal?.designation || "No designation"}
                  </p>
                </div>
              </div>

              <div className="text-gray-800 text-sm space-y-1">
                <p>
                  <span className="font-semibold text-amber-600">Email:</span>{" "}
                  {profile.personal?.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-amber-600">
                    Location:
                  </span>{" "}
                  {profile.personal?.location || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-amber-600">Phone:</span>{" "}
                  {profile.personal?.phone || "N/A"}
                </p>
              </div>

              {/* DELETE & SHARE BUTTONS */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteProfileId(profile._id);
                  }}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareProfile(profile);
                  }}
                  className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  <Share2Icon size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DELETE MODAL */}
        {deleteProfileId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-amber-50/90 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Are you sure you want to delete this profile?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete(
                        `${API_URL}profile/${deleteProfileId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setProfiles(
                        profiles.filter((p) => p._id !== deleteProfileId)
                      );
                      setDeleteProfileId(null);
                    } catch (err) {
                      console.error(err);
                      alert("Error deleting profile.");
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteProfileId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHARE MODAL */}
        {shareProfile && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setShareProfile(null)}
                className="absolute top-4 right-4 text-gray-800 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>

              {/* Profile Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                  <img
                    src={
                      shareProfile.personal?.photo ||
                      "https://www.shopfittingsstore.com.au/9262-medium_default/premium-male-mannequin-m22.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {shareProfile.personal?.name || "No Name"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {shareProfile.personal?.designation || "No Designation"}
                  </p>
                </div>
              </div>

              {/* Profile URL */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value={`${apiUrl}/Portfolio/${shareProfile._id}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none"
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/portfolio/${shareProfile._id}`
                    )
                  }
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                  <Copy className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Social Share Buttons */}
              {/* Social Share Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.origin + "/Portfolio/" + shareProfile._id
                  )}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Linkedin className="w-4 h-4" /> Share on LinkedIn
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.origin + "/Portfolio/" + shareProfile._id
                  )}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-blue-400 text-white py-2 px-4 rounded-xl hover:bg-blue-500 transition-all"
                >
                  <Twitter className="w-4 h-4" /> Share on Twitter
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.origin + "/Portfolio/" + shareProfile._id
                  )}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-pink-500 text-white py-2 px-4 rounded-xl hover:bg-pink-600 transition-all"
                >
                  <Facebook className="w-4 h-4" /> Share on Facebook
                </a>

                {/* ⭐ NEW — View Profile button */}
                <a
                  href={`/portfolio/${shareProfile._id}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-all"
                >
                  <Eye className="w-4 h-4" /> View Profile
                </a>
              </div>
            </div>
          </div>
        )}

        {/* FULL PROFILE MODAL */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-amber-100/90 backdrop-blur-xl border border-amber-200 rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex relative overflow-hidden">
              {/* CLOSE BUTTON */}

              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-5 right-5 text-2xl font-bold text-gray-800 hover:text-amber-700"
              >
                ✕
              </button>

              {/* LEFT SIDEBAR */}
              <div className="w-64 bg-amber-200/80 backdrop-blur-lg border-r border-amber-300 p-6">
                <h3 className="text-2xl font-bold text-amber-800 mb-6"></h3>
                <div className="space-y-3">
                  {sections.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveSection(s.key)}
                      className={`w-full text-left p-3 rounded-xl transition-all font-medium ${
                        activeSection === s.key
                          ? "bg-amber-800 text-white shadow-lg"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="flex-1 p-8 overflow-y-auto">
                {activeSection === "personal" && (
                  <PersonalSection
                    profile={selectedProfile.personal}
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        personal: updated,
                      }))
                    }
                  />
                )}
                {activeSection === "education" && (
                  <EducationSection
                    data={selectedProfile.education || []}
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        education: updated,
                      }))
                    }
                  />
                )}
                {activeSection === "experience" && (
                  <ExperienceSection
                    data={selectedProfile.experience || []}
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        experience: updated,
                      }))
                    }
                  />
                )}
                {activeSection === "projects" && (
                  <ProjectsSection
                    data={selectedProfile.projects || []}
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        projects: updated,
                      }))
                    }
                  />
                )}
                {activeSection === "skills" && (
                  <SkillsSection
                    title="Skills"
                    data={selectedProfile.skills || []}
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        skills: updated,
                      }))
                    }
                  />
                )}
                {activeSection === "certifications" && (
                  <CertificationSection
                    data={selectedProfile.certifications || []}
                    profileId={selectedProfile._id} // <-- Pass it here
                    token={token} // <-- Pass token as well
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        certifications: updated,
                      }))
                    }
                  />
                )}
                {activeSection === "customSections" && (
                  <SectionList
                    data={selectedProfile.customSections || []}
                    onChange={(updated) =>
                      setSelectedProfile((prev) => ({
                        ...prev,
                        customSections: updated,
                      }))
                    }
                  />
                )}

                {/* SAVE BUTTON */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        await axios.put(
                          `${apiUrl}profile/${selectedProfile._id}`,
                          selectedProfile,
                          { headers: { Authorization: `Bearer ${token}` } }
                        );

                        // Show toast
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 1000); // hide after 1 sec
                      } catch (err) {
                        console.error(err);
                        alert("Error saving profile.");
                      }
                    }}
                    className="px-6 py-3 bg-amber-800 text-white rounded-xl hover:bg-amber-900 shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showToast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-green-400/40 backdrop-blur-md text-white font-semibold rounded-xl shadow-lg transition-transform transform duration-1000 ease-out animate-bounce">
          Saved successfully!
        </div>
      )}
    </div>
  );
}

/* PERSONAL SECTION WITH PHOTO UPLOAD */
// import { useState, useEffect } from "react";

export function PersonalSection({ profile, onChange }) {
  const [local, setLocal] = useState(profile || {});

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLocal((prev) => ({ ...prev, photo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => onChange(local), [local]);

  const fields = [
    "name",
    "email",
    "phone",
    "designation",
    "location",
    "website",
    "linkedin",
    "whatsapp",
  ];

  return (
    <div className="space-y-6 p-6 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Photo */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg">
          <img
            src={
              local.photo ||
              "https://www.shopfittingsstore.com.au/9262-medium_default/premium-male-mannequin-m22.jpg"
            }
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* File Input */}
        <div className="flex flex-col items-start gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-sm text-amber-400 font-semibold"
          />
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f} className="flex flex-col">
            <label className="font-semibold text-amber-400 capitalize">
              {f}
            </label>
            <input
              type="text"
              value={local[f] || ""}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, [f]: e.target.value }))
              }
              className="w-full mt-1 p-3 rounded-xl border border-amber-300 bg-white/10 text-amber-800 placeholder-white/50 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              placeholder={`Enter ${f}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Section Box - Upgraded UI */
export function SectionBox({ data, title }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
      {title && (
        <h2 className="text-xl font-bold text-amber-400 mb-4">{title}</h2>
      )}

      {data ? (
        <div className="space-y-3 text-white/90">
          {Object.entries(data).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between items-start bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="font-semibold capitalize">{k}:</span>
              <span>{typeof v === "object" ? JSON.stringify(v) : v}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/50 italic">No data available.</p>
      )}
    </div>
  );
}
