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
