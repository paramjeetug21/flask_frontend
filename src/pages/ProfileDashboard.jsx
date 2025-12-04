import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PortfolioPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`http://localhost:5000/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-indigo-200 animate-pulse">
        Loading Portfolio...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">
        Profile Not Found
      </div>
    );

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-[#0f172a] via-[#243b75] to-[#1b2a5a]">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 space-y-8 animate-fadeIn">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={profile.personal.photo || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
          />
          <div>
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
              {profile.personal?.name}
            </h1>
            <p className="text-xl text-indigo-200">
              {profile.personal?.designation}
            </p>
            <div className="mt-4 space-y-1 text-lg text-indigo-100">
              <p>📧 {profile.personal?.email}</p>
              <p>📍 {profile.personal?.location}</p>
              <p>📞 {profile.personal?.phone}</p>
            </div>
          </div>
        </div>

        {/* SECTIONS WRAPPER */}
        <div className="space-y-6">
          {/* EDUCATION */}
          {profile.education?.length > 0 && (
            <Section title="🎓 Education">
              {profile.education.map((edu, i) => (
                <p key={i} className="text-white/90">
                  {edu.degree} — {edu.institution} ({edu.startDate})
                </p>
              ))}
            </Section>
          )}

          {/* EXPERIENCE */}
          {profile.experience?.length > 0 && (
            <Section title="💼 Experience">
              {profile.experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <h3 className="text-white font-semibold text-lg">
                    {exp.position} — {exp.company}
                  </h3>
                  <p className="text-white/80">
                    {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                  </p>
                  <p className="text-white mt-1">{exp.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {exp.techUsed?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* SKILLS */}
          {profile.skills?.length > 0 && (
            <Section title="🧩 Skills">
              {profile.skills.map((cat, i) => (
                <div key={i} className="mb-4">
                  <p className="font-semibold text-white mb-2">
                    {cat.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* PROJECTS */}
          {profile.projects?.length > 0 && (
            <Section title="📁 Projects">
              {profile.projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="text-white font-semibold text-lg">
                    {proj.projectName}
                  </h3>
                  <p className="text-white/80 mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.techUsed?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 text-white rounded-full border border-white/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* CERTIFICATIONS */}
          {profile.certifications?.length > 0 && (
            <Section title="🏅 Certifications">
              {profile.certifications.map((cert, i) => (
                <p key={i} className="text-white/90">
                  {cert.certificationName} — {cert.issuer}
                </p>
              ))}
            </Section>
          )}

          {/* CUSTOM SECTIONS */}
          {profile.customSections?.length > 0 && (
            <Section title="✨ Custom Sections">
              {profile.customSections.map((sec, i) => (
                <div key={i} className="mb-3">
                  <h3 className="text-white font-semibold">{sec.name}</h3>
                  <p className="text-white/80">
                    {Array.isArray(sec.content)
                      ? sec.content.join(", ")
                      : sec.content}
                  </p>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* REUSABLE SECTION COMPONENT */
function Section({ title, children }) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
