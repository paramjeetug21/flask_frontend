import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  MapPin,
  Mail,
  Globe,
  Linkedin,
  Github,
  Twitter,
  X,
  Code,
  ExternalLink,
  Plus,
  Edit3,
  UserCircle,
  Camera,
  Share2,
  Eye,
  Download,
  Trash2,
  Link as LinkIcon,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Layers,
  Phone,
  ArrowLeft,
  GripVertical, // Added for drag handle
} from "lucide-react";
import { fetchDashboard } from "../api/authApi";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

// --- DND KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SectionList from "../components/Custom";
import CertificationSection from "../components/Certification";
import SkillsSection from "../components/Skill";
import ProjectsSection from "../components/Project";
import EducationSection from "../components/Education";
import ExperienceSection from "../components/Experience";
import InfoPopup from "./Pop.up";
import WarningPopup from "./Warning";
const API_URL = import.meta.env.VITE_API_URL;

export default function PortfolioGallery() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const showSuccess = true;
  const showWarning = false;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }

  const loadProfiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile/user/${token}`);
      let data = res.data || [];

      // --- LOGIC CHANGE: SORT BY LATEST ---
      // Sorts by updatedAt (or createdAt) descending
      data = data.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA; // Newest first
      });

      setProfiles(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) setCurrentUserId(token);
    loadProfiles();
  }, [token]);

  const filteredProfiles = profiles.filter((profile) => {
    const text = searchTerm.toLowerCase();
    const name = profile.personal?.name?.toLowerCase() || "";
    const role = profile.personal?.designation?.toLowerCase() || "";
    return name.includes(text) || role.includes(text);
  });

  const handleCreate = () => {
    setEditingData(null); // Clear any previous edit data
    setIsCreateOpen(true);
  };

  // --- HANDLER: OPEN EDIT (Pre-filled Form) ---
  const handleEdit = (e, profile) => {
    e.stopPropagation(); // Prevent opening the view drawer
    setEditingData(profile); // Pass the profile data to the modal
    setIsCreateOpen(true); // Open the same modal
  };

  // --- HANDLER: DELETE PROFILE ---
  const handleDelete = async (e, profileId) => {
    // 1. Handle the event (works with the mock event from Child)
    if (e && e.stopPropagation) e.stopPropagation();

    // --- REMOVED window.confirm (Child component handled it) ---

    try {
      await axios.delete(`${API_URL}/profile/${profileId}`);

      // Remove from UI immediately
      setProfiles((prev) => prev.filter((p) => p._id !== profileId));

      // Optional: Show "Success" popup
      setNotification({
        show: true,
        type: "success",
        message: "Profile deleted successfully",
      });
      // Auto-hide after 3 seconds
      setTimeout(
        () => setNotification((prev) => ({ ...prev, show: false })),
        3000
      );
    } catch (error) {
      console.error("Error deleting profile:", error);

      // --- REPLACED ALERT WITH POPUP ---
      setNotification({
        show: true,
        type: "warning",
        message: "Failed to delete profile. Please try again.",
      });
    }
  };

  const handleProfileSaved = (newProfileId) => {
    setIsCreateOpen(false);
    setEditingData(null);
    loadProfiles(); // Refresh list to see the new/updated one at top
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 overflow-x-hidden">
      {/* --- HEADER --- */}
      <div className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:text-black hover:bg-white hover:border-zinc-700 transition-all duration-200 mr-2"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>

            <h1 className="text-xl font-bold tracking-tight text-zinc-100 uppercase flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-100 text-zinc-950 rounded flex items-center justify-center font-black text-lg">
                T
              </div>
              <span>
                Talent<span className="text-zinc-500">Directory</span>
              </span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Find talent by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all shadow-inner"
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full md:w-auto px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 bg-zinc-100 text-zinc-950 hover:bg-zinc-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]"
            >
              <Plus size={16} />
              <span>Create Portfolio</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-end justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-3xl font-light text-zinc-100 tracking-tight">
              Featured Portfolios
            </h2>
            <p className="text-zinc-500 mt-2 font-light text-sm">
              Discover professionals and their bodies of work.
            </p>
          </div>
          <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest hidden md:block">
            {filteredProfiles.length} Results Found
          </div>
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <UserCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">
              No profiles found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-sm text-zinc-300 hover:text-white underline underline-offset-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProfiles.map((profile, index) => {
              const profileOwnerId =
                typeof profile.user === "object"
                  ? profile.user._id
                  : profile.user;
              const isOwner = currentUserId && profileOwnerId === currentUserId;

              return (
                <PortfolioCard
                  key={profile._id || index}
                  profile={profile}
                  isOwner={isOwner}
                  onEdit={(e) => handleEdit(e, profile)}
                  onDelete={(e) => handleDelete(e, profile._id)}
                  onClick={() => setSelectedProfile(profile)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* --- DETAIL MODAL (DRAWER) --- */}
      <AnimatePresence>
        {selectedProfile && (
          <PortfolioDrawer
            profile={selectedProfile}
            onClose={() => setSelectedProfile(null)}
          />
        )}
      </AnimatePresence>

      {/* --- CREATE / EDIT PROFILE MODAL --- */}
      <AnimatePresence>
        {isCreateOpen && (
          <CreateProfileModal
            token={token}
            initialData={editingData}
            onProfileCreated={handleProfileSaved}
            onClose={() => setIsCreateOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 2. CREATE / EDIT PROFILE MODAL
// ==========================================

// Define sections with IDs for Drag and Drop
const DEFAULT_SECTIONS = [
  { key: "personal", label: "Personal Info", id: "personal" },
  { key: "education", label: "Education", id: "education" },
  { key: "experience", label: "Experience", id: "experience" },
  { key: "projects", label: "Projects", id: "projects" },
  { key: "skills", label: "Skills", id: "skills" },
  { key: "certifications", label: "Certifications", id: "certifications" },
  { key: "custom", label: "Custom Sections", id: "custom" },
];

function CreateProfileModal({ token, onProfileCreated, onClose, initialData }) {
  const [activeSection, setActiveSection] = useState("personal");

  // --- POPUP STATES ---
  const [infoMessage, setInfoMessage] = useState(null); // For success/error messages
  const [warningData, setWarningData] = useState(null); // For warning dialogs { message, action }

  // --- DND STATE ---
  const [orderedSections, setOrderedSections] = useState(DEFAULT_SECTIONS);

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");

  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [customSections, setCustomSections] = useState([]);

  const [loading, setLoading] = useState(false);

  // Helper to show info popup with auto-hide
  const triggerInfo = (msg) => {
    setInfoMessage(msg);
    setTimeout(() => setInfoMessage(null), 3000);
  };

  useEffect(() => {
    if (initialData) {
      const p = initialData.personal || {};
      const s = initialData.socials || {};

      setName(p.name || "");
      setEmail(p.email || "");
      setDesignation(p.designation || "");
      setLocation(p.location || "");
      setPhone(p.phone || "");
      setPreviewUrl(p.photo || null);
      setAbout(p.about || "");
      setWebsite(s.website || "");
      setLinkedin(s.linkedin || "");
      setTwitter(s.twitter || "");
      setGithub(s.github || "");

      setEducation(initialData.education || []);
      setExperience(initialData.experience || []);
      setProjects(initialData.projects || []);
      setSkills(initialData.skills || []);
      setCertifications(initialData.certifications || []);
      setCustomSections(initialData.customSections || []);

      // ** RESTORE ORDER FROM BACKEND **
      if (initialData.sectionOrder && Array.isArray(initialData.sectionOrder)) {
        const savedOrder = initialData.sectionOrder
          .map((key) => DEFAULT_SECTIONS.find((sec) => sec.key === key))
          .filter(Boolean);

        if (savedOrder.length > 0) {
          // Add any missing sections
          const missing = DEFAULT_SECTIONS.filter(
            (ds) => !initialData.sectionOrder.includes(ds.key)
          );
          setOrderedSections([...savedOrder, ...missing]);
        }
      }
    }
  }, [initialData]);

  // --- DND SENSORS & HANDLERS ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setOrderedSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Check file size
      if (file.size > 2 * 1024 * 1024) {
        // FIXED: Use function to trigger state, not return JSX
        triggerInfo("File is larger than 2MB!");
        return;
      }

      // 2. Use FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      // FIXED: Use function to trigger state
      triggerInfo("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || "";
          const country = data.address.country || "";
          setLocation(`${city}, ${country}`);
        } catch (err) {
          console.error(err);
          triggerInfo("Failed to fetch location data.");
        }
      },
      (err) => {
        console.error(err);
        triggerInfo("Location permission denied or unavailable.");
      }
    );
  };

  const handleGlobalSubmit = async () => {
    // FIXED: Use function to trigger state, then return
    if (!name || !email) {
      triggerInfo("Please enter Name and Email to save!");
      return;
    }

    const payload = {
      user: token,
      sectionOrder: orderedSections.map((s) => s.key),
      updatedAt: new Date().toISOString(),
      personal: {
        name,
        email,
        designation,
        location,
        phone,
        photo: previewUrl,
        about,
      },
      socials: { website, linkedin, twitter, github },
      education,
      experience,
      projects,
      skills,
      certifications,
      customSections,
    };

    setLoading(true);
    try {
      let response;

      if (initialData && initialData._id) {
        // --- EDIT MODE (PUT) ---
        response = await axios.put(
          `${API_URL}/profile/${initialData._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // FIXED: Update state
        triggerInfo("Profile Updated Successfully!");
      } else {
        // --- CREATE MODE (POST) ---
        response = await axios.post(`${API_URL}/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // FIXED: Update state
        triggerInfo("Profile Created Successfully!");
      }

      onProfileCreated(response.data.profile_id || response.data._id);
    } catch (err) {
      console.error("Error saving profile:", err);
      // FIXED: Handle error with Popup
      if (err.response && err.response.status === 413) {
        triggerInfo("Image is too large for the server to accept.");
      } else {
        triggerInfo("Error saving profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <div className="flex-1 max-w-3xl space-y-12 pb-10 animate-in fade-in duration-500">
            <div>
              <h3 className="text-sm font-bold text-zinc-300 border-b border-zinc-800 pb-2 mb-8 uppercase tracking-widest flex items-center gap-2">
                <UserCircle size={16} /> 01. Essentials
              </h3>

              <div className="mb-10 flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Profile Photograph
                </label>
                <div className="flex items-center gap-6">
                  <label className="relative cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center overflow-hidden transition-all group-hover:border-zinc-400 relative">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="text-zinc-600 w-8 h-8" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[9px] font-bold uppercase tracking-widest">
                          {previewUrl ? "Change" : "Upload"}
                        </span>
                      </div>
                    </div>
                  </label>
                  <div className="flex flex-col">
                    <span className="text-sm font-light text-zinc-300">
                      {previewUrl ? "Photo Selected" : "No photo selected"}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      Max 2MB. JPG or PNG.
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <MinimalInput
                  label="Full Name"
                  value={name}
                  onChange={setName}
                  placeholder="Ex. John Doe"
                />
                <MinimalInput
                  label="Email Address"
                  value={email}
                  onChange={setEmail}
                  placeholder="john@example.com"
                />
                <MinimalInput
                  label="Designation"
                  value={designation}
                  onChange={setDesignation}
                  placeholder="Software Engineer"
                />
                <MinimalInput
                  label="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  placeholder="10 Digits"
                />
              </div>

              <div className="mt-8">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  About
                </label>

                <div className="flex items-center border-b border-zinc-800 focus-within:border-zinc-400 transition-colors">
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent outline-none font-light text-base text-zinc-300 placeholder-zinc-700"
                    value={about}
                    placeholder="About yourself in a few words......"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Location
                </label>

                <div className="flex items-center border-b border-zinc-800 focus-within:border-zinc-400 transition-colors">
                  <input
                    type="text"
                    className="w-full py-2 bg-transparent outline-none font-light text-base text-zinc-300 placeholder-zinc-700"
                    value={location}
                    placeholder="City, Country"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <button
                    onClick={fetchLocation}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-1"
                  >
                    <MapPin size={12} /> Locate Me
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-zinc-300 border-b border-zinc-800 pb-2 mb-8 uppercase tracking-widest flex items-center gap-2">
                <Globe size={16} /> 02. Digital Presence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <MinimalInput
                  label="Personal Website"
                  value={website}
                  onChange={setWebsite}
                  placeholder="https://mysite.com"
                />
                <MinimalInput
                  label="LinkedIn Profile"
                  value={linkedin}
                  onChange={setLinkedin}
                  placeholder="linkedin.com/in/username"
                />
                <MinimalInput
                  label="Twitter / X"
                  value={twitter}
                  onChange={setTwitter}
                  placeholder="@username"
                />
                <MinimalInput
                  label="GitHub"
                  value={github}
                  onChange={setGithub}
                  placeholder="github.com/username"
                />
              </div>
            </div>
          </div>
        );

      case "education":
        return <EducationSection data={education} onChange={setEducation} />;
      case "experience":
        return <ExperienceSection data={experience} onChange={setExperience} />;
      case "projects":
        return <ProjectsSection data={projects} onChange={setProjects} />;
      case "skills":
        return <SkillsSection data={skills} onChange={setSkills} />;
      case "certifications":
        return (
          <CertificationSection
            data={certifications}
            onChange={setCertifications}
          />
        );
      case "custom":
        return (
          <SectionList data={customSections} onChange={setCustomSections} />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col overflow-y-auto"
    >
      <div className="w-full h-full max-w-[95%] lg:max-w-7xl mx-auto px-4 md:px-12 pt-10 pb-8">
        <div className="flex justify-between items-start mb-10 border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-100 mb-2">
              {initialData ? "EDIT PORTFOLIO" : "INITIATE PROFILE"}
            </h2>
            <p className="text-zinc-500 font-light text-xs uppercase tracking-widest">
              {initialData
                ? "Update your details"
                : "Establish your digital footprint"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold tracking-widest text-zinc-500 hover:text-red-500 transition-colors uppercase flex items-center gap-2"
          >
            Close <X size={18} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 pb-20">
          <div className="flex-1 w-full relative min-h-[50vh] flex flex-col order-2 lg:order-1">
            <div className="flex-grow">{renderContent()}</div>

            <div className="sticky bottom-0 z-20 mt-8 pt-6 border-t border-zinc-800 bg-[#0a0a0a]/95 backdrop-blur-sm flex justify-between items-center">
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  Current Section
                </span>
                <span className="text-zinc-300 text-sm capitalize">
                  {DEFAULT_SECTIONS.find((s) => s.key === activeSection)?.label}
                </span>
              </div>
              <button
                onClick={handleGlobalSubmit}
                disabled={loading}
                className="group relative px-8 py-3 bg-zinc-100 text-black overflow-hidden w-full md:w-auto shadow-lg shadow-white/5"
              >
                <span className="relative z-10 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2">
                  {loading
                    ? "Saving..."
                    : initialData
                    ? "Update Profile"
                    : "Save Profile"}
                </span>
                <div className="absolute inset-0 h-full w-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out bg-zinc-300 origin-bottom-left" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-64 pt-2 order-1 lg:order-2">
            <div className="sticky top-8 border-l border-zinc-800 pl-8 space-y-6">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-6">
                Navigation & Order
              </span>

              {/* --- DND CONTEXT WRAPPER --- */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedSections}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {orderedSections.map((section) => (
                      <SortableNavItem
                        key={section.id}
                        id={section.id}
                        section={section}
                        isActive={activeSection === section.key}
                        onClick={() => setActiveSection(section.key)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>

          <div className="lg:hidden w-full order-1 overflow-x-auto pb-4 border-b border-zinc-800 mb-6 flex gap-4 scrollbar-hide">
            {orderedSections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`whitespace-nowrap text-xs uppercase tracking-widest px-4 py-2 rounded-full border ${
                  activeSection === section.key
                    ? "bg-zinc-100 text-black border-zinc-100"
                    : "bg-transparent text-zinc-500 border-zinc-800"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- POPUPS RENDERED HERE --- */}
      {infoMessage && <InfoPopup message={infoMessage} />}

      {/* Warning popup included in case you add delete functionality later */}
      {warningData && (
        <WarningPopup
          message={warningData.message}
          onConfirm={() => {
            warningData.action();
            setWarningData(null);
          }}
          onCancel={() => setWarningData(null)}
        />
      )}
    </motion.div>
  );
}

// --- NEW HELPER FOR DRAGGABLE ITEMS ---

function PortfolioCard({ profile, onClick, isOwner, onEdit, onDelete }) {
  const [searchParams] = useSearchParams();
  const { name, designation, photo, location, about } = profile.personal || {};

  // --- POPUP STATE ---
  const [infoMessage, setInfoMessage] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const getFlatSkills = (rawSkills) => {
    if (!rawSkills || !Array.isArray(rawSkills)) return [];
    return rawSkills.flatMap((item) => {
      if (typeof item === "string") return item;
      if (item.skills && Array.isArray(item.skills)) return item.skills;
      if (item.name) return item.name;
      return [];
    });
  };

  const displaySkills = getFlatSkills(profile.skills);

  // Handler to open the page
  const handleViewProfile = (e) => {
    e.stopPropagation(); // Prevent opening the Drawer
    window.open(`/portfolio4/${profile._id}`, "_blank");
  };

  // --- UPDATED DOWNLOAD HANDLER ---
  const handleDownload = (e, _id) => {
    e.stopPropagation();

    // 1. Show Info Popup
    setInfoMessage("Preparing download...");
    setTimeout(() => setInfoMessage(null), 3000);

    // 2. Remove any existing print iframe
    const existingIframe = document.getElementById("print-frame");
    if (existingIframe) {
      document.body.removeChild(existingIframe);
    }

    // 3. Dynamic URL
    const DOWNLOAD_URL = `${window.location.origin}/portfolio-modern/${_id}?print=true`;

    const iframe = document.createElement("iframe");

    // 4. Iframe Settings
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "1024px";
    iframe.style.height = "1000px";
    iframe.style.border = "0";

    iframe.src = DOWNLOAD_URL;
    iframe.id = "print-frame";

    document.body.appendChild(iframe);
  };

  // --- NEW DELETE HANDLERS ---
  const requestDelete = (e) => {
    e.stopPropagation(); // Stop card click
    setShowDeleteWarning(true); // Open local warning
  };

  const confirmDelete = (e) => {
    if (e) e.stopPropagation();
    onDelete(); // Call the parent's delete function
    setShowDeleteWarning(false); // Close local warning
  };

  return (
    <>
      <motion.div
        layoutId={`card-${profile._id}`}
        onClick={onClick}
        whileHover={{ y: -4 }}
        className="group bg-zinc-900 rounded-xl border border-zinc-800 overflow-visible cursor-pointer hover:border-zinc-600 hover:shadow-[0_0_20px_-10px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col h-full relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />

        {isOwner && (
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            {/* EDIT BUTTON */}
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-2 py-1 bg-zinc-100 text-zinc-950 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg hover:bg-zinc-300 transition-colors"
            >
              <Edit3 size={10} />
              <span>Edit</span>
            </button>

            {/* DELETE BUTTON - Now triggers local warning */}
            <button
              onClick={requestDelete}
              className="flex items-center justify-center w-6 h-6 bg-zinc-800 text-red-400 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={10} />
            </button>
          </div>
        )}

        {/* Tighter Layout: p-4 */}
        <div className="p-4 flex items-start gap-3 relative z-10 pt-6">
          {/* Smaller Image: w-12 h-12 */}
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
            <img
              src={
                photo ||
                `https://ui-avatars.com/api/?name=${
                  name || "User"
                }&background=27272a&color=e4e4e7`
              }
              alt={name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-base font-bold text-zinc-100 truncate tracking-tight">
              {name || "Anonymous"}
            </h3>
            <p className="text-xs font-medium text-zinc-400 truncate mb-1.5">
              {designation || "No Title"}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 mb-3">
              <MapPin size={10} />
              <span>{location || "Remote"}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {displaySkills.slice(0, 3).map((skillName, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-950 border border-zinc-800 text-zinc-400 uppercase tracking-wide group-hover:border-zinc-700 transition-colors"
                >
                  {typeof skillName === "string" ? skillName : "Skill"}
                </span>
              ))}
              {displaySkills.length > 3 && (
                <span className="text-[9px] text-zinc-600 py-0.5 px-0.5">
                  +{displaySkills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- FOOTER with SHARE MENU & ACTION BUTTONS --- */}
        <div className="mt-auto border-t border-zinc-800/50 px-4 py-2 bg-zinc-950/30 flex justify-between items-center relative z-30">
          <CardShareMenu profile={profile} />

          <div className="flex items-center gap-2">
            {/* --- VIEW BUTTON WRAPPER --- */}
            <div className="relative group/btn flex items-center justify-center">
              {/* --- FLOATING EYES CONTAINER (Linear Row) --- */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2 flex gap-2 pointer-events-none group-hover/btn:pointer-events-auto z-20">
                {/* 1. Natural Portfolio (Yellow/White) */}
                <button
                  onClick={() =>
                    window.open(`/portfolio-modern/${profile._id}`, "_blank")
                  }
                  className="transform translate-y-2 opacity-0 scale-90 
                   group-hover/btn:translate-y-0 group-hover/btn:opacity-100 group-hover/btn:scale-100 
                   transition-all duration-300 ease-out delay-0 hover:-translate-y-1"
                  title="Natural Portfolio"
                >
                  <div
                    className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center shadow-lg 
                       bg-[linear-gradient(135deg,#FACC15_50%,#FFFFFF_50%)] cursor-pointer hover:shadow-xl"
                  >
                    <Eye size={14} className="text-zinc-900" />
                  </div>
                </button>

                {/* 2. Classic Portfolio (Cream/Red) */}
                <button
                  onClick={() =>
                    window.open(`/portfolio-classic/${profile._id}`, "_blank")
                  }
                  className="transform translate-y-2 opacity-0 scale-90 
                   group-hover/btn:translate-y-0 group-hover/btn:opacity-100 group-hover/btn:scale-100 
                   transition-all duration-300 ease-out delay-75 hover:-translate-y-1"
                  title="Classic Portfolio"
                >
                  <div
                    className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center shadow-lg 
                       bg-[linear-gradient(135deg,#FEF3C7_50%,#EF4444_50%)] cursor-pointer hover:shadow-xl"
                  >
                    <Eye size={14} className="text-zinc-900" />
                  </div>
                </button>

                {/* 3. Bold Portfolio (Light Violet) */}
              </div>

              {/* --- MAIN TRIGGER BUTTON --- */}
              <button
                onClick={() =>
                  window.open(`/portfolio-modern/${profile._id}`, "_blank")
                }
                title="View Profile"
                className="relative z-30 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center 
                 group-hover/btn:bg-zinc-100 group-hover/btn:border-zinc-100 transition-all duration-300"
              >
                <Eye
                  size={12}
                  className="text-zinc-400 group-hover/btn:text-zinc-900 transition-colors"
                />
              </button>
            </div>

            {/* --- DOWNLOAD BUTTON --- */}
            <button
              onClick={(e) => handleDownload(e, profile._id)}
              title="Download Info"
              className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-zinc-100 hover:border-zinc-100 group/btn transition-all duration-300"
            >
              <Download
                size={12}
                className="text-zinc-400 group-hover/btn:text-zinc-900"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- RENDER POPUPS --- */}
      {infoMessage && <InfoPopup message={infoMessage} />}

      {showDeleteWarning && (
        <WarningPopup
          message="Are you sure you want to delete this portfolio? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteWarning(false)}
        />
      )}
    </>
  );
}

function PortfolioDrawer({ profile, onClose }) {
  if (!profile) return null;

  const { personal, socials } = profile;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Sidebar / Drawer Content */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl bg-zinc-950 flex flex-col md:flex-row h-full shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 text-zinc-500 hover:text-white bg-zinc-900/50 rounded-full"
        >
          <X size={20} />
        </button>

        {/* --- LEFT: GRAY PART (Name & Personal Details) --- */}
        <div className="w-full md:w-80 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col gap-6 overflow-y-auto shrink-0">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-700 overflow-hidden mb-4 shadow-xl">
              <img
                src={
                  personal?.photo ||
                  `https://ui-avatars.com/api/?name=${
                    personal?.name || "User"
                  }&background=27272a&color=e4e4e7`
                }
                alt={personal?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {personal?.name}
            </h2>
            <p className="text-sm text-zinc-400 font-medium mt-1">
              {personal?.designation}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2">
              <MapPin size={12} />
              <span>{personal?.location || "Remote"}</span>
            </div>
          </div>

          <div className="border-t border-zinc-800 my-2" />

          {/* Contact Details in Gray Part */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Contact
            </h3>
            {personal?.email && (
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Mail size={14} className="text-zinc-500" />
                <a
                  href={`mailto:${personal.email}`}
                  className="hover:underline"
                >
                  {personal.email}
                </a>
              </div>
            )}
            {personal?.phone && (
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Phone size={14} className="text-zinc-500" />
                <span>{personal.phone}</span>
              </div>
            )}
            {socials?.website && (
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Globe size={14} className="text-zinc-500" />
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline truncate"
                >
                  Website
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 my-2" />

          {/* Social Links in Gray Part */}
          <div className="flex gap-4 justify-center">
            {socials?.linkedin && (
              <a
                href={`https://${socials.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {socials?.github && (
              <a
                href={`https://${socials.github}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {socials?.twitter && (
              <a
                href={`https://${socials.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            )}
          </div>
        </div>

        {/* --- RIGHT: BLACK PART (Main Content) --- */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-zinc-950">
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-light text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Layers size={18} className="text-zinc-500" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills
                  .flatMap((s) => (typeof s === "string" ? s : s.skills || []))
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-light text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Briefcase size={18} className="text-zinc-500" /> Experience
              </h3>
              <div className="space-y-8">
                {profile.experience.map((exp, i) => (
                  <div
                    key={i}
                    className="relative pl-6 border-l border-zinc-800"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <h4 className="text-base font-bold text-zinc-200">
                      {exp.role || "Role"}
                    </h4>
                    <p className="text-sm text-zinc-400">
                      {exp.company} • {exp.duration}
                    </p>
                    <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <section>
              <h3 className="text-lg font-light text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <GraduationCap size={18} className="text-zinc-500" /> Education
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {profile.education.map((edu, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/50 p-4 rounded border border-zinc-800/50"
                  >
                    <h4 className="text-sm font-bold text-zinc-200">
                      {edu.degree}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-light text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Code size={18} className="text-zinc-500" /> Featured Projects
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {profile.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="group border border-zinc-800 bg-zinc-900/30 p-5 rounded-lg hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-zinc-200">{proj.title}</h4>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-white"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.techStack &&
                        proj.techStack.split(",").map((tech, ti) => (
                          <span
                            key={ti}
                            className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800 px-2 py-1 rounded"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function CardShareMenu({ profile }) {
  // Construct a share URL.
  const shareUrl = `${window.location.origin}/profile/${profile._id}`;
  const shareText = `Check out ${
    profile.personal?.name || "this"
  }'s portfolio!`;

  const handleShare = (platform) => {
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(
          shareText + " " + shareUrl
        )}`;
        break;

      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;

      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;

      case "email":
        const subject = `Check out ${
          profile.personal?.name || "this"
        }'s Portfolio`;
        const body = `${shareText}\n\n${shareUrl}`;

        // 1. Construct the mailto URL
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;

        // 2. Open it in '_self' to trigger the default mail app without a blank tab
        window.open(mailtoUrl, "_self");
        return;

      case "copy":
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => alert("Link copied to clipboard!"))
          .catch(() => alert("Failed to copy link"));
        return;

      default:
        return;
    }

    if (url) window.open(url, "_blank");
  };

  return (
    <div
      className="relative group/share flex items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 cursor-pointer text-zinc-500 group-hover/share:text-zinc-200 transition-colors py-2">
        <Share2 size={12} />
        <span className="text-[9px] uppercase tracking-widest font-bold">
          Share
        </span>
      </div>

      {/* Popup Container */}
      <div className="absolute left-0 bottom-full mb-0 pb-3 flex items-center gap-1.5 opacity-0 scale-90 translate-y-2 group-hover/share:translate-y-0 group-hover/share:opacity-100 group-hover/share:scale-100 transition-all duration-300 pointer-events-none group-hover/share:pointer-events-auto origin-bottom-left z-50">
        {/* ADD type="button" TO ALL BUTTONS BELOW */}

        <button
          type="button"
          onClick={() => handleShare("whatsapp")}
          className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle size={12} />
        </button>

        <button
          type="button"
          onClick={() => handleShare("linkedin")}
          className="w-7 h-7 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Linkedin size={12} />
        </button>

        <button
          type="button"
          onClick={() => handleShare("twitter")}
          className="w-7 h-7 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Twitter size={12} />
        </button>

        <button
          type="button"
          onClick={() => handleShare("email")}
          className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Mail size={12} />
        </button>

        <button
          type="button"
          onClick={() => handleShare("copy")}
          className="w-7 h-7 rounded-full bg-zinc-700 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <LinkIcon size={12} />
        </button>
      </div>
    </div>
  );
}

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
function SortableNavItem({ id, section, isActive, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between group rounded p-2 -ml-2 select-none ${
        isDragging ? "bg-zinc-900 opacity-80" : ""
      }`}
    >
      <div
        onClick={onClick}
        className="flex items-center gap-3 cursor-pointer flex-grow"
      >
        <div
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            isActive ? "bg-zinc-200" : "bg-zinc-800 group-hover:bg-zinc-600"
          }`}
        />
        <span
          className={`text-sm tracking-wide transition-colors ${
            isActive
              ? "font-medium text-zinc-200"
              : "font-light text-zinc-600 group-hover:text-zinc-400"
          }`}
        >
          {section.label}
        </span>
      </div>

      <div
        {...attributes}
        {...listeners}
        className="text-zinc-800 group-hover:text-zinc-500 cursor-grab active:cursor-grabbing p-1"
      >
        <GripVertical size={14} />
      </div>
    </div>
  );
}
