import React, { useEffect, useState } from "react";
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
  Code,
  Terminal,
  Database,
  Layout,
  Server,
  Share2,
  FileText,
  CheckCircle,
  Phone, // Added Phone Icon
} from "lucide-react";
import axios from "axios";
import API_URL from "../api/authApi";

// --- CONSTANTS FOR LAYOUT ALIGNMENT ---
const SECTION_WIDTH = "max-w-6xl";
const SECTION_PADDING = "px-6 py-20";

export default function ViewPortfolio2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MOUSE SPOTLIGHT STATE ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  // --- SCROLL HOOKS ---
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Background Animations
  const glowOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.8, 0.5, 0.8]
  );

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
      year: "numeric",
    });
  };

  //Helper to remove duplicates
  const getUniqueSkills = (skills) => {
    const flat = getFlatSkills(skills);
    return [...new Set(flat)];
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
      case "personal":
        return (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 min-h-[85vh]`}
          >
            {/* LEFT: Text Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-block px-4 py-1 mb-4 border border-purple-500/50 rounded-full bg-purple-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <span className="text-purple-200 text-sm font-medium tracking-wider uppercase">
                  {personal?.designation || "Creative Developer"}
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-2xl">
                Hello, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-white">
                  {personal?.name}
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 font-light">
                {personal?.about}
              </p>

              {/* Socials & Contact */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {/* 1. EMAIL */}
                {personal?.email && (
                  <SocialBtn
                    href={`mailto:${personal.email}`}
                    icon={<Mail size={20} />}
                    label="Email"
                    primary
                  />
                )}

                {/* 2. PHONE (ADDED) */}
                {personal?.phone && (
                  <SocialBtn
                    href={`tel:${personal.phone}`}
                    icon={<Phone size={20} />}
                    label="Call Me"
                  />
                )}

                {/* 3. GITHUB */}
                {socials?.github && (
                  <SocialBtn
                    href={socials.github}
                    icon={<Github size={20} />}
                  />
                )}

                {/* 4. LINKEDIN */}
                {socials?.linkedin && (
                  <SocialBtn
                    href={socials.linkedin}
                    icon={<Linkedin size={20} />}
                  />
                )}
              </div>

              {personal?.location && (
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-gray-400 text-sm font-mono">
                  <MapPin size={14} className="text-purple-400" />
                  {personal.location}
                </div>
              )}
            </motion.div>

            {/* RIGHT: Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-white opacity-20 group-hover:opacity-40 blur-[80px] transition-opacity duration-700 rounded-full scale-110"></div>
              <div className="absolute inset-0 -m-4 border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(147,51,234,0.3)] relative z-10 bg-black">
                <img
                  src={
                    personal?.photo ||
                    `https://ui-avatars.com/api/?name=${personal?.name}&background=1a1a1a&color=fff`
                  }
                  alt={personal?.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
            </motion.div>
          </section>
        );

      case "experience":
        return experience?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto`}
          >
            <SectionHeader title="Experience" subtitle="My Journey" />

            <div className="space-y-8">
              {experience.map((exp, i) => (
                <GlassCard
                  key={i}
                  index={i}
                  className="flex flex-col md:flex-row gap-6 p-6"
                >
                  <div className="md:w-1/4 flex flex-col border-l-2 border-purple-500/40 pl-4 py-1">
                    <span className="text-purple-300 font-mono font-bold text-sm">
                      {formatDate(exp.startDate)}
                    </span>
                    <span className="text-gray-500 text-xs font-mono mb-2">
                      to
                    </span>
                    <span className="text-white font-mono font-bold text-sm">
                      {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {exp.position}
                    </h3>
                    <div className="text-purple-400 font-medium mb-3 flex items-center gap-2">
                      <Briefcase size={14} /> {exp.company}
                      <span className="mx-2 text-gray-600">|</span>
                      <span className="text-gray-400 text-sm">
                        {exp.location}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;

      case "projects":
        return projects?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto`}
          >
            <SectionHeader
              title="Featured Projects"
              subtitle="What I've Built"
            />
            <div className="grid grid-cols-1 gap-8 md:gap-12">
              {projects.map((proj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500"
                >
                  <div className="grid md:grid-cols-12 gap-0 m-1">
                    <div className="md:col-span-4 bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center border-r border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-900/10 z-0"></div>
                      <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-purple-500 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-2xl border border-white/5">
                        <Code size={40} />
                      </div>
                    </div>
                    <div className="md:col-span-8 p-6 md:p-8 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {proj.title}
                        </h3>
                        <div className="flex gap-3">
                          {proj.projectLink && (
                            <a
                              href={proj.projectLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all border border-white/10"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                          {proj.githubLink && (
                            <a
                              href={proj.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all border border-white/10"
                            >
                              <Github size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                        {proj.description}
                      </p>

                      <div>
                        <div className="flex flex-wrap gap-2">
                          {proj.techUsed?.map((tech, t) => (
                            <span
                              key={t}
                              className="px-3 py-1 bg-[#151515] border border-white/10 rounded-md text-xs font-mono text-purple-300 shadow-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;

      case "certifications":
        return certifications?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto`}
          >
            <SectionHeader title="Certifications" subtitle="Credentials" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0f0f10]/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-purple-500/40 hover:bg-[#1a1a1a] transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-900/20 text-purple-400 rounded-lg border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Award size={24} />
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2 leading-tight">
                    {cert.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>{cert.issuer}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono text-gray-500">
                    <span>Issued</span>
                    <span>{formatDate(cert.date)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;

      // --- CUSTOM SECTIONS: GROUPED UNDER ONE HEADER ---
      case "custom":
        return customSections?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto`}
          >
            {/* 1. Single Section Header */}
            <SectionHeader title="More Info" subtitle="Additional Details" />

            {/* 2. Container for all custom cards */}
            <div className="flex flex-col gap-6">
              {customSections.map((section, sIndex) => (
                <GlassCard key={sIndex} className="p-8">
                  <div className="prose prose-invert max-w-none text-gray-300">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-purple-500" />
                      {section.title}
                    </h3>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {section.description ||
                        section.content ||
                        "No details provided."}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        ) : null;

      case "skills":
        return skills?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto`}
          >
            <SectionHeader title="Technical Skills" subtitle="My Arsenal" />
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                className="z-20 mb-8 px-8 py-3 bg-white text-black font-black text-lg rounded-full shadow-[0_0_40px_rgba(255,255,255,0.5)] border-4 border-purple-500"
              >
                CORE SKILLS
              </motion.div>
              <div className="relative w-full max-w-3xl">
                <div className="absolute left-1/2 top-[-2rem] bottom-0 w-1 bg-gradient-to-b from-white via-purple-500 to-transparent -translate-x-1/2 opacity-50 rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 relative z-10">
                  {/* --- UNIQUE SKILLS CHECK APPLIED HERE --- */}
                  {getUniqueSkills(skills).map((skill, i) => {
                    const isEven = i % 2 === 0;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center ${
                          isEven
                            ? "md:flex-row-reverse md:col-start-1 md:text-right"
                            : "md:col-start-2 md:text-left"
                        } flex-row justify-start`}
                      >
                        <div
                          className={`hidden md:block w-12 h-[2px] bg-purple-500/50 absolute ${
                            isEven ? "right-[-3rem]" : "left-[-3rem]"
                          } top-1/2`}
                        >
                          <div
                            className={`absolute w-3 h-3 bg-purple-400 rounded-full top-1/2 -translate-y-1/2 shadow-[0_0_10px_purple] ${
                              isEven ? "left-0" : "right-0"
                            }`}
                          ></div>
                        </div>
                        <div
                          className={`flex items-center gap-3 p-3 bg-[#111] border border-white/10 rounded-xl hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all w-full md:w-auto group`}
                        >
                          <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                            {getSkillIcon(skill) || <Terminal size={18} />}
                          </div>
                          <span className="font-bold text-gray-300 group-hover:text-white">
                            {skill}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ) : null;

      case "education":
        return education?.length > 0 ? (
          <section
            key={`sec-${index}`}
            className={`w-full ${SECTION_WIDTH} ${SECTION_PADDING} mx-auto`}
          >
            <SectionHeader title="Education" subtitle="Academic Background" />
            <div className="relative ml-4 md:ml-0 space-y-12 border-l-2 border-white/10 md:border-none">
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative md:grid md:grid-cols-12 md:gap-8 items-start pl-8 md:pl-0"
                >
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 bg-purple-500 rounded-full md:hidden shadow-[0_0_10px_purple]"></div>
                  <div className="hidden md:flex md:col-span-3 justify-end pt-2">
                    <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-purple-300">
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    </div>
                  </div>
                  <div className="hidden md:flex md:col-span-1 flex-col items-center h-full">
                    <div className="w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_20px_purple] relative z-10 border-2 border-black"></div>
                    <div className="w-[2px] bg-gradient-to-b from-purple-500/50 to-transparent h-full -mt-2"></div>
                  </div>
                  <div className="md:col-span-8 bg-[#0f0f10]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="text-purple-400" size={24} />
                      <h3 className="text-xl font-bold text-white">
                        {edu.institution}
                      </h3>
                    </div>
                    <div className="text-lg text-white font-serif italic mb-4">
                      {edu.degree} in {edu.field}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                    {edu.grade && (
                      <div className="mt-4 inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded">
                        Grade: {edu.grade}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-[100vh] bg-black text-white font-sans selection:bg-purple-500 selection:text-white pb-32 overflow-x-hidden">
      {/* --- BACKGROUND LIGHTING ENHANCED --- */}

      {/* 1. Mouse Follower - Brighter and Larger */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.25), transparent 70%)`,
        }}
      ></div>

      {/* 2. Static Background Mesh/Blobs - Brighter */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute top-[-20%] right-[-10%] w-[900px] h-[900px] bg-purple-800/40 rounded-full blur-[180px]"
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-indigo-900/50 rounded-full blur-[150px]" />

        {/* Added Center Glow for visibility */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-125 contrast-150"></div>
      </motion.div>

      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen error={error} navigate={navigate} />
      ) : (
        <div className="relative z-10 flex flex-col items-center w-full">
          {profile?.sectionOrder?.map((sectionName, index) =>
            renderSection(sectionName, index)
          )}

          <footer className="w-full py-12 text-center border-t border-white/5 mt-20 bg-black/60 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-2">
              Let's Connect
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Open to new opportunities and collaborations.
            </p>
            <p className="text-gray-600 text-xs font-mono">
              © {new Date().getFullYear()} {profile?.personal?.name}.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function GlassCard({ children, className = "", index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-2xl bg-[#0f0f10]/70 backdrop-blur-md border border-white/5 hover:border-purple-500/50 shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-12 text-center md:text-left">
      <h3 className="text-sm font-bold text-purple-400 uppercase tracking-[0.2em] mb-3 flex items-center justify-center md:justify-start gap-2">
        <span className="w-8 h-[2px] bg-purple-500 box-shadow-glow"></span>
        {subtitle}
      </h3>
      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
        {title}
      </h2>
    </div>
  );
}

function SocialBtn({ href, icon, label, primary }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
        primary
          ? "bg-white text-black hover:bg-gray-200 hover:scale-105 hover:shadow-white/20"
          : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple-500 hover:shadow-purple-500/20"
      }`}
    >
      {icon} {label && <span>{label}</span>}
    </a>
  );
}

function getSkillIcon(skillName) {
  const lower = skillName.toLowerCase();
  if (lower.includes("react") || lower.includes("next"))
    return <Code size={18} />;
  if (
    lower.includes("node") ||
    lower.includes("js") ||
    lower.includes("script")
  )
    return <Terminal size={18} />;
  if (
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("tailwind")
  )
    return <Layout size={18} />;
  if (
    lower.includes("data") ||
    lower.includes("sql") ||
    lower.includes("mongo")
  )
    return <Database size={18} />;
  if (lower.includes("cloud") || lower.includes("aws"))
    return <Server size={18} />;
  if (lower.includes("git")) return <Share2 size={18} />;
  return null;
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_purple]"></div>
      <p className="text-xs uppercase tracking-widest animate-pulse text-purple-400">
        Loading Profile...
      </p>
    </div>
  );
}

function ErrorScreen({ error, navigate }) {
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="text-center max-w-md border border-red-500/20 p-10 rounded-2xl bg-red-900/10 backdrop-blur-sm">
        <h2 className="text-red-500 font-bold text-xl mb-2">Unavailable</h2>
        <p className="text-gray-400 mb-6 text-sm">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
