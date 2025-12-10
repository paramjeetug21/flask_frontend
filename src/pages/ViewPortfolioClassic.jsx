import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Briefcase,
  Award,
  Code,
  Terminal,
  Database,
  Layout,
  Server,
  Share2,
  Phone,
  FolderOpen,
} from "lucide-react";
import axios from "axios";
import API_URL from "../api/authApi";

// --- CONSTANTS FOR LAYOUT ---
const CREAM_BG = "bg-[#fcf8ed]";
const RED_BG = "bg-[#570000]";
const SECTION_WIDTH = "max-w-7xl";
const SECTION_PADDING = "px-6 py-20";

export default function ViewPortfolio3() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- SCROLL HOOKS ---
  const { scrollYProgress } = useScroll();
  useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profile/${id}`);
        setProfile(response.data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  // --- SECTION RENDERER ---
  const renderSection = (sectionName, index) => {
    if (!profile) return null;
    const {
      personal,
      experience,
      projects,
      education,
      skills,
      certifications,
      customSections,
      socials,
    } = profile;

    switch (sectionName) {
      // 1. PERSONAL (Header)
      case "personal":
        return (
          <section
            key={`sec-${index}`}
            className={`w-full ${CREAM_BG} min-h-screen flex flex-col justify-center relative overflow-hidden`}
          >
            <div
              className={`${SECTION_WIDTH} mx-auto px-6 w-full h-full flex flex-col justify-center items-center relative z-10`}
            >
              {/* Giant Name */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[15vw] md:text-[12vw] leading-none font-sans font-bold text-[#4a0d0d] uppercase tracking-tighter text-center"
              >
                {personal?.name?.split(" ")[0] || "PORTFOLIO"}
                <span className="text-[#bf925b]">.</span>
              </motion.h1>

              {/* Sub Details */}
              <div className="mt-12 w-full flex flex-col md:flex-row justify-between items-end gap-8">
                {/* Left: Socials */}
                <div className="flex gap-4">
                  {personal?.email && (
                    <SocialIcon
                      href={`mailto:${personal.email}`}
                      icon={<Mail size={24} />}
                    />
                  )}
                  {socials?.github && (
                    <SocialIcon
                      href={socials.github}
                      icon={<Github size={24} />}
                    />
                  )}
                  {socials?.linkedin && (
                    <SocialIcon
                      href={socials.linkedin}
                      icon={<Linkedin size={24} />}
                    />
                  )}
                </div>

                {/* Right: Designation & Contact Info */}
                <div className="text-right flex flex-col items-end">
                  <h2 className="text-xl md:text-3xl font-light text-[#4a0d0d] mb-2">
                    {personal?.designation || "Digital Product Designer"}
                  </h2>

                  <div className="flex flex-col items-end gap-1 text-[#bf925b] font-medium">
                    {personal?.location && (
                      <p className="flex items-center justify-end gap-2">
                        <MapPin size={16} /> {personal.location}
                      </p>
                    )}
                    {personal?.phone && (
                      <p className="flex items-center justify-end gap-2">
                        <Phone size={16} /> {personal.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      // 2. ABOUT
      case "about":
        return (
          <section key={`sec-about-${index}`} className="w-full bg-white py-24">
            <div
              className={`${SECTION_WIDTH} mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="order-2 md:order-1"
              >
                <h2 className="text-5xl md:text-6xl font-bold text-[#4a0d0d] mb-8">
                  About
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                  {personal?.about ||
                    "Passionate about creating digital experiences."}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="order-1 md:order-2 flex justify-center"
              >
                <img
                  src={
                    personal?.photo ||
                    `https://ui-avatars.com/api/?name=${personal?.name}&background=ebd5b3&color=4a0d0d`
                  }
                  alt={personal?.name}
                  className="w-full max-w-md grayscale hover:grayscale-0 transition-all duration-700 object-cover shadow-2xl"
                />
              </motion.div>
            </div>
          </section>
        );

      // 3. EXPERIENCE
      case "experience":
        return experience?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${RED_BG} ${SECTION_PADDING} text-white`}
          >
            <div className={`${SECTION_WIDTH} mx-auto`}>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-5xl md:text-6xl font-normal mb-16 tracking-tight"
              >
                Experience
              </motion.h2>

              <div className="border-t border-white/20">
                {experience.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group border-b border-white/20 py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors px-4"
                  >
                    <div className="md:w-1/3">
                      <h3 className="text-2xl md:text-3xl font-medium mb-2">
                        {exp.position}
                      </h3>
                      <p className="text-white/60 text-sm md:hidden">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </p>
                    </div>

                    <div className="md:w-1/3 text-white/70 hidden md:block">
                      <span className="font-mono">
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      </span>
                    </div>

                    <div className="md:w-1/3 flex justify-between items-center w-full md:justify-end gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-lg text-[#bf925b]">{exp.company}</p>
                        <p className="text-xs text-white/50 uppercase tracking-widest">
                          {exp.location}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 4. EDUCATION
      case "education":
        return education?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${RED_BG} ${SECTION_PADDING} text-white border-t border-white/10`}
          >
            <div className={`${SECTION_WIDTH} mx-auto`}>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-5xl md:text-6xl font-normal mb-16 tracking-tight"
              >
                Education
              </motion.h2>

              <div className="border-t border-white/20">
                {education.map((edu, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group border-b border-white/20 py-8 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors px-4"
                  >
                    <div className="md:w-1/2">
                      <h3 className="text-2xl md:text-3xl font-medium">
                        {edu.field}
                      </h3>
                      <p className="text-white/60 text-lg mt-1">{edu.degree}</p>
                    </div>
                    <div className="md:w-1/2 flex flex-col md:items-end">
                      <p className="text-[#bf925b] text-xl">
                        {edu.institution}
                      </p>
                      <p className="font-mono text-sm text-white/50 mt-1">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 5. SKILLS - (UPDATED: CATEGORY CARDS)
      case "skills":
        return skills?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${CREAM_BG} ${SECTION_PADDING}`}
          >
            <div className={`${SECTION_WIDTH} mx-auto`}>
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-bold text-[#4a0d0d] mb-4">
                  My Expertise
                </h2>
                <p className="text-gray-500 text-lg">
                  Technical skills and proficiencies
                </p>
              </div>

              {/* Grid of Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skills.map((skillGroup, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-8 shadow-[8px_8px_0px_0px_rgba(74,13,13,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(74,13,13,0.15)] transition-all duration-300 border border-[#4a0d0d]/5"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 border-b border-[#bf925b]/30 pb-4">
                      <div className="p-2 bg-[#fcf8ed] rounded-lg text-[#bf925b]">
                        <Code size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-[#4a0d0d] uppercase tracking-wide">
                        {skillGroup.category}
                      </h3>
                    </div>

                    {/* Skills List */}
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(skillGroup.skills) &&
                        skillGroup.skills.map((skill, k) => (
                          <span
                            key={k}
                            className="px-3 py-1.5 text-sm font-medium text-[#4a0d0d] bg-[#fcf8ed] border border-[#bf925b]/20 rounded-md hover:border-[#bf925b] hover:bg-white transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 6. PROJECTS - (UPDATED: NO GIANT LETTERS, HOVER REVEAL)
      case "projects":
        return projects?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${CREAM_BG} ${SECTION_PADDING}`}
          >
            <div className={`${SECTION_WIDTH} mx-auto`}>
              <h2 className="text-5xl md:text-6xl font-bold text-[#4a0d0d] mb-16 text-center md:text-left">
                Selected Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {projects.map((proj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative h-[350px] bg-white shadow-xl overflow-hidden cursor-pointer"
                  >
                    {/* --- STATE 1: DEFAULT VIEW (Title & Tech) --- */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-10">
                      <div className="mb-6 p-4 rounded-full bg-[#fcf8ed] text-[#bf925b]">
                        <FolderOpen size={40} />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#4a0d0d] text-center mb-4">
                        {proj.projectName || "Untitled Project"}
                      </h3>
                      <div className="w-16 h-1 bg-[#bf925b] mb-6"></div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {proj.techUsed?.slice(0, 3).map((tech, t) => (
                          <span
                            key={t}
                            className="text-xs font-bold uppercase tracking-wider text-gray-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* --- STATE 2: HOVER OVERLAY (Description & Links) --- */}
                    <div className="absolute inset-0 bg-[#570000] p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {proj.projectName}
                      </h3>

                      {/* Description with clamping */}
                      <p className="text-white/80 leading-relaxed mb-8 line-clamp-5 text-sm md:text-base">
                        {proj.description || "No description provided."}
                      </p>

                      <div className="flex gap-4">
                        {proj.projectLink && (
                          <a
                            href={proj.projectLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-2 bg-white text-[#570000] font-bold rounded-full hover:bg-[#bf925b] hover:text-white transition-colors flex items-center gap-2"
                          >
                            <ExternalLink size={16} /> Demo
                          </a>
                        )}
                        {proj.githubLink && (
                          <a
                            href={proj.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-2 border border-white text-white font-bold rounded-full hover:bg-white hover:text-[#570000] transition-colors flex items-center gap-2"
                          >
                            <Github size={16} /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 7. CERTIFICATIONS
      case "certifications":
        return certifications?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${RED_BG} ${SECTION_PADDING} text-white`}
          >
            <div className={`${SECTION_WIDTH} mx-auto`}>
              <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
                <Award className="text-[#bf925b]" /> Certifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="border border-white/20 p-8 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold">{cert.name}</h4>
                      {cert.certificateURL && (
                        <a
                          href={cert.certificateURL}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="text-[#bf925b]" size={18} />
                        </a>
                      )}
                    </div>
                    <p className="text-white/60 mb-2">{cert.issuer}</p>
                    <p className="text-xs font-mono text-[#bf925b]">
                      {formatDate(cert.issueDate)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 8. CUSTOM SECTIONS
      case "custom":
        return customSections?.length > 0 ? (
          <div key={`sec-${index}`}>
            {customSections.map((section, sIndex) => (
              <section
                key={sIndex}
                className={`w-full ${CREAM_BG} ${SECTION_PADDING}`}
              >
                <div className={`${SECTION_WIDTH} mx-auto`}>
                  <h2 className="text-4xl font-bold text-[#4a0d0d] mb-8">
                    {section.title}
                  </h2>
                  <div className="p-8 bg-white border-2 border-[#570000] shadow-[8px_8px_0px_0px_rgba(87,0,0,0.2)]">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                      {section.description || section.content}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} navigate={navigate} />;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#4a0d0d] selection:text-white">
      {/* Main Content */}
      <div className="flex flex-col w-full">
        {renderSection("personal", 0)}
        {renderSection("about", 1)}

        {/* Dynamic Sections */}
        {profile?.sectionOrder?.map((sectionName, index) => {
          if (sectionName === "personal") return null;
          return renderSection(sectionName, index + 2);
        })}

        {/* Footer */}
        <footer className={`w-full py-16 ${RED_BG} text-white text-center`}>
          <div className={`${SECTION_WIDTH} mx-auto px-6`}>
            <h2 className="text-3xl font-bold mb-6">Let's work together.</h2>
            <div className="flex justify-center gap-6 mb-12">
              {profile?.personal?.email && (
                <a
                  href={`mailto:${profile.personal.email}`}
                  className="text-[#bf925b] hover:text-white transition-colors uppercase tracking-widest text-sm font-bold border-b border-[#bf925b] pb-1"
                >
                  Email Me
                </a>
              )}
            </div>
            <p className="text-white/30 text-xs font-mono">
              © {new Date().getFullYear()} {profile?.personal?.name}. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS & HELPERS ---

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#4a0d0d] hover:text-[#bf925b] transition-colors p-2 border border-[#4a0d0d]/10 hover:border-[#bf925b] rounded-full"
    >
      {icon}
    </a>
  );
}

function LoadingScreen() {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${CREAM_BG}`}
    >
      <div className="w-16 h-16 border-4 border-[#4a0d0d] border-t-[#bf925b] rounded-full animate-spin mb-4"></div>
      <p className="text-[#4a0d0d] font-bold tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}

function ErrorScreen({ error, navigate }) {
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-white text-gray-900">
      <div className="text-center max-w-md">
        <h2 className="text-red-600 font-bold text-2xl mb-4">
          Profile Unavailable
        </h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-[#4a0d0d] text-white font-bold uppercase tracking-widest hover:bg-[#bf925b] transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
