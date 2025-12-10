import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Phone,
  ExternalLink,
  Code,
  Menu,
  X,
  Award,
} from "lucide-react";
import axios from "axios";
import API_URL from "../api/authApi";

// --- ASSETS ---
const PORTFOLIO_IMAGE_PATH = "/src/assets/portfolioImages/Portfolio4.png";

// --- CONSTANTS ---
const THEME = {
  bg: "bg-black",
  text: "text-gray-400",
  heading: "text-white",
  accent: "text-[#ffbd39]", // Gold/Yellow
  accentBg: "bg-[#ffbd39]",
  cardLight: "bg-[#fff9e6]", // Yellowish White for project cards
  cardDark: "bg-[#1a1a1a]",
};

export default function ViewPortfolio4() {
  const { id } = useParams();
  const navigate = useNavigate();

  // INITIALIZE SEARCH PARAMS
  const [searchParams] = useSearchParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // --- SCROLL HOOKS ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
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
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // PRINT TRIGGER LOGIC
  useEffect(() => {
    if (!loading && profile) {
      const isPrintMode = searchParams.get("print") === "true";
      if (isPrintMode) {
        const timer = setTimeout(() => {
          window.print();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, profile, searchParams]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsNavOpen(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.getFullYear();
  };

  // --- REMOVED getUniqueSkills FUNCTION (No longer needed) ---

  // --- RENDER SECTIONS ---
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
    } = profile;

    switch (sectionName) {
      // 1. PERSONAL (HOME)
      case "personal":
        return (
          <section
            id="home"
            key={`sec-${index}`}
            className="relative w-full min-h-screen pt-20 flex items-center justify-center overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <span
                  className={`text-xl font-bold uppercase tracking-widest ${THEME.accent}`}
                >
                  Hello!
                </span>
                <h1 className="text-6xl md:text-8xl font-bold text-white mt-4 mb-4 leading-tight">
                  I'm{" "}
                  <span className={THEME.accent}>
                    {personal?.name || "Clark Thompson"}
                  </span>
                </h1>

                <h2 className="text-2xl md:text-4xl font-medium text-white mb-8">
                  <span className="underline decoration-[#ffbd39]">
                    {personal?.designation || "Web Designer"}
                  </span>
                </h2>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => scrollToSection("contact")}
                    className={`${THEME.accentBg} text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors duration-300`}
                  >
                    Hire Me
                  </button>
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    My Works
                  </button>
                </div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2 flex justify-center relative"
              >
                <img
                  src={personal?.photo || PORTFOLIO_IMAGE_PATH}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/600x800?text=Profile";
                  }}
                  alt={personal?.name}
                  className="w-full max-w-md object-cover z-10 drop-shadow-2xl"
                  style={{ maxHeight: "80vh" }}
                />
              </motion.div>
            </div>
          </section>
        );

      // 2. ABOUT
      case "about":
        return (
          <section
            id="about"
            key={`sec-${index}`}
            className="w-full py-32 relative bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
              backgroundImage: `url(${
                personal?.photo || PORTFOLIO_IMAGE_PATH
              })`,
            }}
          >
            <div className="absolute inset-0 bg-black/80"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="max-w-3xl">
                <h2 className="text-6xl font-bold text-white mb-8">About Me</h2>
                <p className="text-gray-300 text-xl leading-relaxed mb-12">
                  {personal?.about ||
                    "I am a passionate designer & developer willing to learn and create."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <InfoRow label="Name" value={personal?.name} />
                  <InfoRow label="Address" value={personal?.location} />
                  <InfoRow label="Email" value={personal?.email} />
                  <InfoRow label="Phone" value={personal?.phone} />
                </div>
              </div>
            </div>
          </section>
        );

      // 3. EXPERIENCE
      case "experience":
        return experience?.length > 0 ? (
          <section
            id="experience"
            key={`sec-exp-${index}`}
            className="w-full py-24 relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="relative h-32 flex items-center justify-center mb-16">
                <span className="absolute text-[6rem] md:text-[8rem] font-black text-white opacity-25 uppercase select-none">
                  Experience
                </span>
                <h2 className="relative text-5xl font-bold text-[#ffbd39] uppercase z-10">
                  Experience
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {experience.map((item, i) => (
                  <ResumeCard key={i} item={item} type="Exp" />
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 4. EDUCATION
      case "education":
        return education?.length > 0 ? (
          <section
            id="education"
            key={`sec-edu-${index}`}
            className="w-full py-24 relative overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="relative h-32 flex items-center justify-center mb-16">
                <span className="absolute text-[6rem] md:text-[8rem] font-black text-white opacity-25 uppercase select-none">
                  Education
                </span>
                <h2 className="relative text-5xl font-bold text-[#ffbd39] uppercase z-10">
                  Education
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {education.map((item, i) => (
                  <ResumeCard key={i} item={item} type="Edu" />
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 5. SKILLS - (UPDATED TO CATEGORY CARDS)
      case "skills":
        return skills?.length > 0 ? (
          <section id="skills" key={`sec-${index}`} className="w-full py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-4">
                  My Skills
                </h2>
                <p className="text-gray-500">My technical expertise</p>
              </div>

              {/* Grid Layout for Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skills.map((skillGroup, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${THEME.cardDark} flex flex-col p-8 rounded-sm hover:bg-[#222] transition-colors border-t-4 border-[#ffbd39] shadow-lg`}
                  >
                    {/* Category Title */}
                    <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                      <Code className="text-[#ffbd39]" size={24} />
                      {skillGroup.category}
                    </h3>

                    {/* Skills Grid inside the card */}
                    <div className="flex flex-wrap gap-3">
                      {Array.isArray(skillGroup.skills) &&
                        skillGroup.skills.map((skillName, k) => (
                          <span
                            key={k}
                            className="px-3 py-2 text-sm font-medium text-gray-300 bg-black/50 border border-white/10 rounded-sm hover:border-[#ffbd39] hover:text-[#ffbd39] transition-all cursor-default"
                          >
                            {skillName}
                          </span>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 6. PROJECTS
      case "projects":
        return projects?.length > 0 ? (
          <section id="projects" key={`sec-${index}`} className="w-full py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="relative h-32 flex items-center justify-center mb-16">
                <span className="absolute text-[6rem] md:text-[8rem] font-black text-white opacity-25 uppercase select-none">
                  Projects
                </span>
                <h2 className="relative text-5xl font-bold text-[#ffbd39] uppercase z-10">
                  My Projects
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((proj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className={`group relative h-80 overflow-hidden cursor-pointer ${THEME.cardLight} shadow-lg`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:opacity-0 transition-opacity duration-300">
                      <div className="text-6xl font-black text-gray-200 mb-4">
                        {proj.projectName?.substring(0, 2).toUpperCase()}
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        {proj.projectName}
                      </h3>
                      <span className="text-gray-600 text-sm uppercase tracking-widest">
                        {proj.description || "View Project"}
                      </span>
                    </div>

                    <div
                      className={`absolute inset-0 ${THEME.accentBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-10`}
                    >
                      <h3 className="text-2xl font-bold text-black mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {proj.projectName}
                      </h3>
                      <span className="text-black/70 font-bold uppercase tracking-widest text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {proj.techUsed?.join(", ")}
                      </span>

                      <div className="flex gap-4 mt-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                        {proj.projectLink && (
                          <a
                            href={proj.projectLink}
                            target="_blank"
                            className="p-3 bg-black text-white rounded-full hover:bg-white hover:text-black transition-all"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                        {proj.githubLink && (
                          <a
                            href={proj.githubLink}
                            target="_blank"
                            className="p-3 bg-black text-white rounded-full hover:bg-white hover:text-black transition-all"
                          >
                            <Github size={20} />
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
            id="certifications"
            key={`sec-${index}`}
            className="w-full py-24"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="relative h-32 flex items-center justify-center mb-16">
                <span className="absolute text-[5rem] md:text-[7rem] font-black text-white opacity-25 uppercase select-none">
                  Certifications
                </span>
                <h2 className="relative text-4xl font-bold text-[#ffbd39] uppercase z-10">
                  Certificates
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className={`${THEME.cardDark} p-8 hover:bg-[#222] transition-colors border-l-4 border-[#ffbd39]`}
                  >
                    <Award className="text-[#ffbd39] mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {cert.name}
                    </h3>
                    <p className="text-gray-500 uppercase text-sm tracking-wider mb-4">
                      {cert.issuer}
                    </p>
                    <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
                      <span className="text-xs text-gray-600 font-mono">
                        {formatDate(cert.issueDate)}
                      </span>
                      {cert.certificateURL && (
                        <a
                          href={cert.certificateURL}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#ffbd39] hover:underline text-sm"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      // 8. CUSTOM
      case "custom":
        return customSections?.length > 0 ? (
          <section id="details" key={`sec-${index}`} className="w-full py-24">
            <div className="max-w-7xl mx-auto px-6">
              {/* SINGLE Header for all custom sections */}
              <div className="relative h-32 flex items-center justify-center mb-16">
                <span className="absolute text-[5rem] md:text-[8rem] font-black text-white opacity-25 uppercase select-none">
                  Details
                </span>
                <h2 className="relative text-4xl font-bold text-[#ffbd39] uppercase z-10">
                  More Details
                </h2>
              </div>

              {/* Grid of Custom Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {customSections.map((sec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${THEME.cardDark} p-10 border-l-4 border-[#ffbd39] shadow-lg hover:bg-[#222] transition-colors`}
                  >
                    {/* Title moved inside the card */}
                    <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">
                      {sec.title}
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                      {sec.description || sec.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} navigate={navigate} />;

  return (
    <div
      className={`${THEME.bg} min-h-screen font-sans selection:bg-[#ffbd39] selection:text-black`}
    >
      {/* --- PROGRESS BAR --- */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#ffbd39] origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 w-full z-40 bg-black/90 backdrop-blur-sm border-b border-white/10 transition-all`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white uppercase tracking-wider">
            {profile?.personal?.name?.split(" ")[0] || "My"}
            <span className="text-[#ffbd39]">Portfolio</span>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8">
            {[
              "Home",
              "About",
              "Education",
              "Experience",
              "Skills",
              "Projects",
              "Details",
            ].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-white text-sm uppercase tracking-widest hover:text-[#ffbd39] transition-colors font-medium"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isNavOpen && (
          <div className="md:hidden bg-black border-t border-white/10 py-4 absolute w-full">
            <ul className="flex flex-col items-center gap-4">
              {[
                "Home",
                "About",
                "Education",
                "Experience",
                "Skills",
                "Projects",
                "Details",
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-white text-sm uppercase tracking-widest hover:text-[#ffbd39]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col w-full">
        {renderSection("personal", 0)}
        {renderSection("about", 1)}

        {/* Render sections based on API order */}
        {profile?.sectionOrder && profile.sectionOrder.length > 0 ? (
          profile.sectionOrder.map((sectionName, index) => {
            if (sectionName === "personal" || sectionName === "about")
              return null;
            return renderSection(sectionName, index + 2);
          })
        ) : (
          <>
            {renderSection("education", 2)}
            {renderSection("experience", 3)}
            {renderSection("skills", 4)}
            {renderSection("projects", 5)}
            {renderSection("certifications", 6)}
            {renderSection("custom", 7)}
          </>
        )}

        {/* Footer */}
        <footer
          id="contact"
          className="py-24 bg-black border-t border-white/10 text-center"
        >
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-white mb-8">Contact Me</h2>
            <p className="text-gray-400 mb-12 text-lg">
              I'm available for work. Let's get in touch!
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
              {/* Address - Only shows if location exists */}
              {profile?.personal?.location && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#ffbd39]">
                    <MapPin size={24} />
                  </div>
                  <p className="text-white font-bold uppercase tracking-widest text-sm">
                    Address
                  </p>
                  <p className="text-gray-400">{profile.personal.location}</p>
                </div>
              )}

              {/* Phone - Only shows if phone exists */}
              {profile?.personal?.phone && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#ffbd39]">
                    <Phone size={24} />
                  </div>
                  <p className="text-white font-bold uppercase tracking-widest text-sm">
                    Contact Number
                  </p>
                  <p className="text-gray-400">{profile.personal.phone}</p>
                </div>
              )}

              {/* Email - Only shows if email exists */}
              {profile?.personal?.email && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#ffbd39]">
                    <Mail size={24} />
                  </div>
                  <p className="text-white font-bold uppercase tracking-widest text-sm">
                    Email Address
                  </p>
                  <p className="text-gray-400">{profile.personal.email}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {profile?.socials?.linkedin && (
                <SocialButton
                  href={profile.socials.linkedin}
                  icon={<Linkedin />}
                />
              )}
              {profile?.socials?.github && (
                <SocialButton href={profile.socials.github} icon={<Github />} />
              )}
              {profile?.personal?.email && (
                <SocialButton
                  href={`mailto:${profile.personal.email}`}
                  icon={<Mail />}
                />
              )}
            </div>

            <p className="text-gray-600 mt-16">
              &copy; {new Date().getFullYear()} {profile?.personal?.name}.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @media print {
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            background-color: black !important;
          }
          * {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
          }
          nav, .fixed.top-0 {
            display: none !important;
          }
          p, h1, h2, h3, h4, span, div {
             text-shadow: none !important;
          }
          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ResumeCard({ item, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`${THEME.cardDark} p-8 rounded-sm hover:bg-[#222] transition-colors group border-b-2 border-transparent hover:border-[#ffbd39]`}
    >
      <span className={`${THEME.accent} text-xl font-bold block mb-2`}>
        {item.startDate ? new Date(item.startDate).getFullYear() : "2023"} -{" "}
        {item.endDate ? new Date(item.endDate).getFullYear() : "Present"}
      </span>
      <h3 className="text-2xl text-white font-medium mb-1">
        {type === "Edu" ? item.degree : item.position}
      </h3>
      <span className="text-xs uppercase tracking-widest text-gray-500 mb-6 block">
        {type === "Edu" ? item.institution : item.company}
      </span>
      <p className="text-gray-400 text-sm leading-relaxed">
        {item.description || item.field}
      </p>
    </motion.div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center mb-2">
      <span className="w-32 text-[#ffbd39] font-bold uppercase tracking-wider text-sm mb-1 sm:mb-0">
        {label}:
      </span>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}

function SocialButton({ href, icon }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white hover:bg-[#ffbd39] hover:text-black transition-all"
    >
      {icon}
    </a>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-16 h-16 border-4 border-[#1a1a1a] border-t-[#ffbd39] rounded-full animate-spin mb-4"></div>
      <p className="text-white font-bold tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
}

function ErrorScreen({ error, navigate }) {
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="text-center max-w-md">
        <h2 className="text-[#ffbd39] font-bold text-2xl mb-4">
          Profile Unavailable
        </h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-[#ffbd39] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-full"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
