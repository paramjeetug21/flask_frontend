import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Calendar,
  Code,
  User,
  FileText,
} from "lucide-react";
import axios from "axios";
import API_URL from "../api/authApi";

// ✅ IMAGES
import IMG_HERO from "../assets/portfolioImages/IMG_HERO.jpg";
import IMG_END from "../assets/portfolioImages/IMG_END.png";
import IMG_WORK from "../assets/portfolioImages/IMG_WORK.png";

export default function ViewPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- SCROLL HOOKS ---
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax Logic
  const opacityHero = useTransform(smoothProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const opacityWork = useTransform(
    smoothProgress,
    [0.3, 0.4, 0.6, 0.7],
    [0, 1, 1, 0]
  );
  const opacityEnd = useTransform(smoothProgress, [0.6, 0.7, 1], [0, 1, 1]);

  const scaleHero = useTransform(smoothProgress, [0, 0.4], [1, 1.1]);
  const scaleWork = useTransform(smoothProgress, [0.3, 0.7], [1, 1.1]);
  const scaleEnd = useTransform(smoothProgress, [0.6, 1], [1, 1.1]);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profile/${id}`);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // Helper to format dates (e.g., 2025-12-01 -> Dec 2025)
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
  };

  // --- DYNAMIC SECTION RENDERER ---
  const renderSection = (sectionName, index) => {
    // Safety check for data
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
      case "personal":
        return (
          <section
            key={`sec-${index}`}
            className="min-h-screen w-full flex items-center justify-center px-6 py-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              // ✅ CHANGE 1: Increased gap-12 to gap-24 (and added gap-y-12 for mobile vertical spacing)
              className="grid grid-cols-1 lg:grid-cols-2  gap-x-44 items-center w-full max-w-7xl"
            >
              {/* --- LEFT SIDE: PHOTO --- */}
              {/* ✅ Added 'group' here so the hover effect triggers on the whole area */}
              <div className="flex justify-center lg:justify-end relative group cursor-pointer">
                <div className="relative">
                  {/* Rotating Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 10,
                      ease: "linear",
                    }}
                    // ✅ CHANGE 3: Changed border-white/20 to border-white (Solid White)
                    className="absolute inset-0 -m-6 border-2 border-dashed border-white rounded-full"
                  ></motion.div>

                  {/* Static Ring */}
                  <div className="absolute inset-0 -m-3 border border-white/40 rounded-full"></div>

                  {/* Main Image */}
                  {/* ✅ CHANGE 2: Added group-hover shadow for White + Violet mix & transition */}
                  <div
                    className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 
                    shadow-[0_0_80px_rgba(168,85,247,0.4)] 
                    group-hover:shadow-[0_0_100px_rgba(168,85,247,0.8),0_0_40px_rgba(255,255,255,0.8)] 
                    transition-all duration-500 ease-in-out
                    bg-black z-10 relative"
                  >
                    <img
                      src={
                        personal?.photo ||
                        `https://ui-avatars.com/api/?name=${personal?.name}&background=random`
                      }
                      alt={personal?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {personal?.location && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl whitespace-nowrap z-20">
                      <MapPin size={14} className="text-purple-400" />
                      {personal.location}
                    </div>
                  )}
                </div>
              </div>

              {/* --- RIGHT SIDE: DETAILS --- */}
              <div className="text-center lg:text-left space-y-6">
                <div>
                  <h2 className="text-lg font-medium tracking-[0.4em] text-white/60 uppercase mb-2">
                    Hello, I am
                  </h2>

                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-2xl leading-none">
                    {personal?.name}
                  </h1>

                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 mt-4">
                    <p className="text-3xl md:text-4xl font-bold font-serif italic text-white">
                      {personal?.designation}
                    </p>
                    <span className="hidden lg:block h-[1px] w-20 bg-white/20"></span>
                  </div>
                </div>

                {/* --- ABOUT ME SECTION --- */}
                {personal?.about && (
                  <div className="py-4">
                    <p className="text-lg italic font-semibold text-white leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                      {personal.about}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-md text-black font-mono">
                  {personal?.email && (
                    <span className="flex items-center gap-2">
                      <Mail size={16} className="text-purple-400" />{" "}
                      {personal.email}
                    </span>
                  )}
                  {personal?.phone && (
                    <span className="hidden md:inline">|</span>
                  )}
                  {personal?.phone && <span>{personal.phone}</span>}
                </div>

                {/* SOCIALS */}
                <div className="flex justify-center lg:justify-start gap-4 pt-2">
                  <SocialIcon href={socials?.github} icon={<Github />} />
                  <SocialIcon href={socials?.linkedin} icon={<Linkedin />} />
                  <SocialIcon href={socials?.website} icon={<Globe />} />
                </div>
              </div>
            </motion.div>
          </section>
        );
        return (
          <section
            key={`sec-${index}`}
            className="min-h-screen w-full flex items-center justify-center px-6 py-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl"
            >
              {/* --- LEFT SIDE: PHOTO --- */}
              <div className="flex justify-center lg:justify-end relative">
                <div className="relative">
                  {/* Rotating Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 10,
                      ease: "linear",
                    }}
                    className="absolute inset-0 -m-6 border-2 border-dashed border-white/20 rounded-full"
                  ></motion.div>

                  {/* Static Ring */}
                  <div className="absolute inset-0 -m-3 border border-white/40 rounded-full"></div>

                  {/* Main Image */}
                  <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_80px_rgba(168,85,247,0.4)] bg-black z-10 relative">
                    <img
                      src={
                        personal?.photo ||
                        `https://ui-avatars.com/api/?name=${personal?.name}&background=random`
                      }
                      alt={personal?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {personal?.location && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl whitespace-nowrap z-20">
                      <MapPin size={14} className="text-purple-400" />
                      {personal.location}
                    </div>
                  )}
                </div>
              </div>

              {/* --- RIGHT SIDE: DETAILS --- */}
              <div className="text-center lg:text-left space-y-6">
                <div>
                  <h2 className="text-lg font-medium tracking-[0.4em] text-white/60 uppercase mb-2">
                    Hello, I am
                  </h2>

                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-2xl leading-none">
                    {personal?.name}
                  </h1>

                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 mt-4">
                    <p className="text-3xl md:text-4xl font-bold font-serif italic text-white">
                      {personal?.designation}
                    </p>
                    <span className="hidden lg:block h-[1px] w-20 bg-white/20"></span>
                  </div>
                </div>

                {/* --- ABOUT ME SECTION --- */}
                {personal?.about && (
                  <div className="py-4">
                    <p className="text-lg italic font-semibold text-white leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                      {personal.about}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-md text-black font-mono">
                  {personal?.email && (
                    <span className="flex items-center gap-2">
                      <Mail size={16} className="text-purple-400" />{" "}
                      {personal.email}
                    </span>
                  )}
                  {personal?.phone && (
                    <span className="hidden md:inline">|</span>
                  )}
                  {personal?.phone && <span>{personal.phone}</span>}
                </div>

                {/* SOCIALS */}
                <div className="flex justify-center lg:justify-start gap-4 pt-2">
                  <SocialIcon href={socials?.github} icon={<Github />} />
                  <SocialIcon href={socials?.linkedin} icon={<Linkedin />} />
                  <SocialIcon href={socials?.website} icon={<Globe />} />
                </div>
              </div>
            </motion.div>
          </section>
        );

      case "experience":
        return experience?.length > 0 ? (
          <section key={`sec-${index}`} className="w-full max-w-6xl px-6 py-20">
            <SectionTitle icon={<Briefcase />} title="Work Experience" />
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <GlassCard key={i} index={i}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Dates & Location */}
                    <div className="md:col-span-3 border-l-2 border-purple-500/30 pl-4 flex flex-col justify-center">
                      <div className="text-purple-300 font-bold font-mono text-sm flex items-center gap-2 mb-1">
                        <Calendar size={14} />
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      </div>
                      <div className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={12} /> {exp.location}
                      </div>
                    </div>
                    {/* Right: Content */}
                    <div className="md:col-span-9">
                      <h3 className="text-3xl font-bold text-white mb-1">
                        {exp.position}
                      </h3>
                      <h4 className="text-xl text-purple-200 font-serif italic mb-4">
                        {exp.company}
                      </h4>

                      <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                        {exp.description}
                      </p>

                      {exp.techUsed && exp.techUsed.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.techUsed.map((tech, t) => (
                            <span
                              key={t}
                              className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold uppercase text-purple-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;

      case "projects":
        return projects?.length > 0 ? (
          <section key={`sec-${index}`} className="w-full max-w-6xl px-6 py-20">
            <SectionTitle icon={<Code />} title="Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj, i) => (
                <GlassCard
                  key={i}
                  index={i}
                  className="p-0 overflow-hidden flex flex-col"
                >
                  {/* Project Image */}
                  <div className="h-64 bg-gray-900 relative group overflow-hidden">
                    {/* Placeholder Gradient if no image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black transition-transform duration-700 group-hover:scale-110"></div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm gap-4">
                      {proj.projectLink && (
                        <a
                          href={" " + proj.projectLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2 bg-white text-black font-bold rounded-full text-sm flex items-center gap-2 hover:scale-105 transition"
                        >
                          <Globe size={16} /> Live Demo
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={" " + proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2 bg-black border border-white text-white font-bold rounded-full text-sm flex items-center gap-2 hover:scale-105 transition"
                        >
                          <Github size={16} /> Code
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition">
                        {proj.title || "Project Title"}
                      </h3>
                      <span className="text-xs text-gray-500 font-mono border border-gray-700 px-2 py-1 rounded">
                        {formatDate(proj.endDate)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {proj.technologies?.map((tech, t) => (
                        <span
                          key={t}
                          className="text-[10px] font-bold uppercase text-purple-300 bg-purple-900/20 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;

      case "education":
        return education?.length > 0 ? (
          <section key={`sec-${index}`} className="w-full max-w-6xl px-6 py-20">
            <SectionTitle icon={<GraduationCap />} title="Education" />
            <div className="space-y-6">
              {education.map((edu, i) => (
                <GlassCard key={i} index={i}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {edu.institution}
                      </h3>
                      <h4 className="text-xl text-purple-300 font-serif italic mt-1">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-white mt-4 max-w-2xl">
                        {edu.description}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end min-w-[150px]">
                      <span className="text-sm font-bold font-mono text-gray-300 mb-2">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                      {edu.grade && (
                        <div className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm font-bold text-white">
                          Grade: {edu.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;

      case "certifications":
        return certifications?.length > 0 ? (
          <section key={`sec-${index}`} className="w-full max-w-6xl px-6 py-20">
            <SectionTitle icon={<Award />} title="Certifications" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, i) => (
                <GlassCard
                  key={i}
                  index={i}
                  className="flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {cert.certificationName}
                    </h3>
                    <p className="text-purple-300 text-sm font-bold uppercase tracking-widest mb-1">
                      {cert.issuer}
                    </p>
                    <p className="text-gray-500 text-xs font-mono">
                      Issued: {formatDate(cert.issueDate)}
                    </p>
                  </div>
                  {cert.certificateURL && (
                    <a
                      href={cert.certificateURL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-purple-400 transition self-start border-b border-transparent hover:border-purple-400 pb-1"
                    >
                      View Credential <ExternalLink size={14} />
                    </a>
                  )}
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;

      case "skills":
        return skills?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className="w-full max-w-4xl px-6 py-20 text-center mx-auto"
          >
            <h2 className="text-4xl font-black text-white mb-10 uppercase tracking-widest">
              Technical skills
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {getFlatSkills(skills).map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-lg font-bold text-white hover:bg-white/20 hover:scale-105 hover:border-purple-500 transition shadow-lg cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;

      case "custom":
        return customSections?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className="w-full max-w-6xl px-6 py-20 mx-auto"
          >
            {/* Grid layout to keep cards small and inline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customSections.map((sec, k) => (
                <GlassCard key={k} index={k} className="flex flex-col">
                  {/* Header of the Custom Card */}
                  <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                    <div className="p-2 bg-purple-900/30 rounded-lg text-purple-300">
                      <FileText size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                      {sec.name}
                    </h3>
                  </div>
                  {/* Content of the Custom Card */}
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {sec.content}
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100vh] bg-black text-white font-sans selection:bg-purple-500 selection:text-white pb-32"
    >
      {/* --- LOADING / ERROR --- */}
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen error={error} navigate={navigate} />
      ) : (
        <>
          {/* --- BACKGROUND (Fixed) --- */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              style={{ opacity: opacityEnd, scale: scaleEnd }}
              className="absolute inset-0"
            >
              <img
                src={IMG_END}
                alt="Forest"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
            </motion.div>
            <motion.div
              style={{ opacity: opacityWork, scale: scaleWork }}
              className="absolute inset-0"
            >
              <img
                src={IMG_WORK}
                alt="Mountains"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
            </motion.div>
            <motion.div
              style={{ opacity: opacityHero, scale: scaleHero }}
              className="absolute inset-0"
            >
              <img
                src={IMG_HERO}
                alt="Sunset"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
            </motion.div>
          </div>

          {/* --- SCROLLABLE CONTENT --- */}
          <div className="relative z-10 flex flex-col items-center w-full">
            {/* Render sections in the exact order from DB */}
            {profile?.sectionOrder?.map((sectionName, index) =>
              renderSection(sectionName, index)
            )}

            {/* Footer */}
            <footer className="w-full py-12 text-center border-t border-white/10 mt-20">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                © {new Date().getFullYear()}{" "}
                {profile?.personal?.name || "Portfolio"}.
              </p>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}

// --- HELPERS & SUB-COMPONENTS ---

function GlassCard({ children, className = "", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.08] transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <motion.h2
      initial={{ x: -20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      className="text-4xl font-black text-white flex items-center gap-4 mb-12 uppercase tracking-tight"
    >
      <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl text-white shadow-lg shadow-purple-900/40">
        {icon}
      </div>
      {title}
    </motion.h2>
  );
}

function SocialIcon({ href, icon }) {
  if (!href) return null;
  const link = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function getFlatSkills(rawSkills) {
  if (!rawSkills || !Array.isArray(rawSkills)) return [];
  return rawSkills.flatMap((item) => {
    if (typeof item === "string") return item;
    if (item.skills && Array.isArray(item.skills)) return item.skills;
    if (item.name) return item.name;
    return [];
  });
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-white rounded-full animate-spin mb-6"></div>
      <p className="text-white font-bold tracking-[0.3em] uppercase text-xs animate-pulse">
        Loading...
      </p>
    </div>
  );
}

function ErrorScreen({ error, navigate }) {
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-black">
      <div className="text-center max-w-md bg-white/5 border border-red-500/50 p-10 rounded-3xl backdrop-blur-xl">
        <h2 className="text-red-400 font-black text-2xl mb-4">Error</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
