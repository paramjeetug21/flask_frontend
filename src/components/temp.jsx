import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
} from "lucide-react";
import axios from "axios";
import API_URL from "../api/authApi";

export default function ViewPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profile/${id}`);
        // Based on your console log, the data is directly in response.data
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to fetch profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} navigate={navigate} />;

  // --- SAFE DATA DESTRUCTURING ---
  // We default to empty objects/arrays to prevent crashes
  const {
    personal = {},
    experience = [],
    projects = [],
    education = [],
    skills = [],
    certifications = [],
    socials = {},
  } = profile || {};

  const { name, designation, location, photo, email, phone } = personal;

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#1c1c1c] font-sans selection:bg-[#faedcd] overflow-x-hidden">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-[#FFFBEB]/90 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Optional: Add smooth scroll links here if needed */}
          <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
            {experience.length > 0 && <span>Work</span>}
            {projects.length > 0 && <span>Projects</span>}
            <span>Contact</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {/* --- HERO SECTION --- */}
        <header className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left: Text Content */}
          <div className="space-y-8 order-2 lg:order-1 animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 rounded-full border border-black bg-white text-xs font-bold uppercase tracking-widest mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Available for work
            </div>

            <div className="space-y-2">
              <p className="text-xl md:text-2xl font-medium text-gray-600">
                Hello, I'm{" "}
                <span className="text-black font-bold">{name || "User"}</span>
              </p>
              <h1 className="text-6xl md:text-8xl font-black text-[#0f0f0f] leading-[0.9] tracking-tighter uppercase">
                {designation || "Creator"}
              </h1>
            </div>

            <div className="flex flex-col gap-1 text-lg font-medium text-gray-600">
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-black" />
                  <span>Based in {location}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail size={20} className="text-black" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`mailto:${email}`}
                className="px-8 py-4 bg-black text-[#FFFBEB] font-bold uppercase tracking-widest rounded-lg shadow-[6px_6px_0px_0px_rgba(233,217,133,1)] hover:translate-y-1 hover:shadow-none transition-all border-2 border-black flex items-center gap-2"
              >
                <Mail size={18} /> Contact Me
              </a>
              {/* If you have a resume link in data, use it here. Currently using a placeholder download */}
              <button className="px-8 py-4 bg-[#E9D985] text-black font-bold uppercase tracking-widest rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all border-2 border-black flex items-center gap-2">
                <Download size={18} /> Resume
              </button>
            </div>
          </div>

          {/* Right: BIG Image */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
              {/* Decoration Elements */}
              <div className="absolute top-0 right-0 w-full h-full border-4 border-black rounded-full translate-x-4 translate-y-4 bg-[#E9D985]"></div>

              {/* Main Image */}
              <div className="absolute inset-0 w-full h-full rounded-full border-4 border-black overflow-hidden bg-white z-10">
                <img
                  src={
                    photo ||
                    `https://ui-avatars.com/api/?name=${name}&background=fff&color=000&size=512`
                  }
                  alt={name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Icon */}
              <div className="absolute bottom-4 left-4 z-20 bg-white p-3 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Globe size={24} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-8 space-y-20">
            {/* 1. WORK EXPERIENCE */}
            {experience && experience.length > 0 && (
              <section className="animate-fade-in-up delay-100">
                <h2 className="text-4xl md:text-5xl font-black text-black mb-10 flex items-center gap-3">
                  <Briefcase className="w-8 h-8 md:w-10 md:h-10 border-2 border-black p-1 rounded bg-[#E9D985]" />
                  Experience.
                </h2>
                <div className="border-l-4 border-black ml-4 space-y-12">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-12">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[14px] top-2 w-6 h-6 rounded-full bg-white border-4 border-black"></div>

                      <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(233,217,133,1)] transition-shadow">
                        <span className="inline-block px-3 py-1 bg-black text-[#FFFBEB] text-xs font-bold uppercase tracking-widest rounded mb-3">
                          {exp.year || exp.duration || "Date"}
                        </span>
                        <h3 className="text-2xl font-bold text-black">
                          {exp.company}
                        </h3>
                        <p className="text-lg font-bold text-gray-500 mb-4">
                          {exp.role || exp.designation}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. PROJECTS */}
            {projects && projects.length > 0 && (
              <section className="animate-fade-in-up delay-200">
                <h2 className="text-4xl md:text-5xl font-black text-black mb-10 flex items-center gap-3">
                  <ExternalLink className="w-8 h-8 md:w-10 md:h-10 border-2 border-black p-1 rounded bg-[#E9D985]" />
                  Projects.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="group bg-white rounded-xl border-2 border-black overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {/* Image Area */}
                      <div className="h-48 bg-gray-100 border-b-2 border-black overflow-hidden relative">
                        {proj.image ? (
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#FDFCF5] text-gray-400 font-bold uppercase tracking-widest">
                            Project {idx + 1}
                          </div>
                        )}
                        {/* Overlay Link */}
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-3 right-3 p-2 bg-white border-2 border-black rounded-full hover:bg-[#E9D985] transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-black mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {proj.description}
                        </p>
                        {/* Tech Stack if available */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {proj.technologies.slice(0, 3).map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-bold uppercase border border-gray-300 px-2 py-1 rounded bg-gray-50 text-gray-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* --- RIGHT COLUMN (Sidebar Info) --- */}
          <div className="lg:col-span-4 space-y-12">
            {/* 3. SKILLS */}
            {skills && skills.length > 0 && (
              <section className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getFlatSkills(skills).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#FFFBEB] border-2 border-black rounded font-bold text-sm hover:bg-[#E9D985] transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 4. EDUCATION */}
            {education && education.length > 0 && (
              <section className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-2 flex items-center gap-2">
                  <GraduationCap size={20} /> Education
                </h3>
                <div className="space-y-6">
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {edu.year || "Year"}
                      </span>
                      <h4 className="text-lg font-bold text-black leading-tight">
                        {edu.degree || edu.course}
                      </h4>
                      <p className="text-sm font-medium text-gray-600">
                        {edu.institution || edu.school}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. CERTIFICATIONS */}
            {certifications && certifications.length > 0 && (
              <section className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-2 flex items-center gap-2">
                  <Award size={20} /> Certifications
                </h3>
                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <h4 className="font-bold text-black text-sm">
                        {cert.name}
                      </h4>
                      <p className="text-xs text-gray-500">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. SOCIALS */}
            {socials && Object.values(socials).some((val) => val) && (
              <section className="bg-[#E9D985] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black uppercase tracking-widest mb-6 pb-2 border-b-2 border-black/10">
                  Connect
                </h3>
                <div className="flex flex-col gap-3">
                  {socials.github && (
                    <SocialRow
                      href={socials.github}
                      icon={<Github size={18} />}
                      label="Github"
                    />
                  )}
                  {socials.linkedin && (
                    <SocialRow
                      href={socials.linkedin}
                      icon={<Linkedin size={18} />}
                      label="LinkedIn"
                    />
                  )}
                  {socials.twitter && (
                    <SocialRow
                      href={socials.twitter}
                      icon={<Twitter size={18} />}
                      label="Twitter"
                    />
                  )}
                  {socials.website && (
                    <SocialRow
                      href={socials.website}
                      icon={<Globe size={18} />}
                      label="Website"
                    />
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/10 py-12 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} {name}. Built with TalentDirectory.
        </p>
      </footer>
    </div>
  );
}

// --- HELPER FUNCTIONS & COMPONENTS ---

// Helper to handle mixed string/object skills
function getFlatSkills(rawSkills) {
  if (!rawSkills || !Array.isArray(rawSkills)) return [];
  return rawSkills.flatMap((item) => {
    if (typeof item === "string") return item;
    if (item.skills && Array.isArray(item.skills)) return item.skills;
    if (item.name) return item.name;
    return [];
  });
}

function SocialRow({ href, icon, label }) {
  if (!href) return null;
  const link = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-lg hover:translate-x-1 transition-transform"
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
      <ExternalLink size={12} className="ml-auto text-gray-400" />
    </a>
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFBEB]">
      <div className="w-16 h-16 border-4 border-[#E9D985] border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-black font-bold tracking-widest uppercase text-sm">
        Loading Portfolio...
      </p>
    </div>
  );
}

function ErrorScreen({ error, navigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFBEB] p-6 text-center">
      <div className="max-w-md w-full bg-white border-2 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl font-black text-red-500 mb-2 uppercase tracking-wide">
          Error
        </h2>
        <p className="text-gray-600 mb-6 font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-wider"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
