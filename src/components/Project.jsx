import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLink,
  AiOutlineGithub,
  AiOutlineCalendar,
} from "react-icons/ai";

// --- Helper: Darker Animated Minimal Input ---
const MinimalInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  max, // Added max prop for date inputs
}) => (
  <div className="relative flex flex-col w-full group">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        max={max} // Apply max date if provided
        className="peer w-full py-2 border-b border-gray-400 bg-transparent outline-none font-medium text-sm placeholder-gray-400 text-gray-900 transition-all focus:border-black"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {/* Animated Underline */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-500 ease-out peer-focus:w-full" />
    </div>
  </div>
);

// --- Helper: Darker Animated Minimal Text Area ---
const MinimalTextArea = ({ label, value, onChange, placeholder }) => (
  <div className="relative flex flex-col w-full group">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="relative">
      <textarea
        rows={3}
        className="peer w-full py-2 border-b border-gray-400 bg-transparent outline-none font-medium text-sm placeholder-gray-400 text-gray-900 transition-all resize-none focus:border-black leading-relaxed"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {/* Animated Underline */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-500 ease-out peer-focus:w-full" />
    </div>
  </div>
);

export default function ProjectsSection({
  title = "Projects",
  data = [],
  onChange,
}) {
  const [projects, setProjects] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [error, setError] = useState(""); // Validation Error State

  // New Project State
  const [newProject, setNewProject] = useState({
    projectName: "",
    projectLink: "",
    githubLink: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    description: "",
    techUsed: "",
  });

  // Get today's date for max attribute
  const today = new Date().toISOString().split("T")[0];

  // --- EFFECT WITH INFINITE LOOP FIX ---
  useEffect(() => {
    const processedData = data.map((item) => ({
      ...item,
      techUsed: Array.isArray(item.techUsed)
        ? item.techUsed.join(", ")
        : item.techUsed || "",
    }));

    setProjects((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(processedData)) {
        return processedData;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const autoSave = (updatedProjects) => {
    const formattedForSave = updatedProjects.map((item) => ({
      ...item,
      techUsed:
        typeof item.techUsed === "string"
          ? item.techUsed
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : item.techUsed,
    }));
    setProjects(updatedProjects);
    if (onChange) onChange(formattedForSave);
  };

  // --- VALIDATION LOGIC ---
  const validateEntry = (entry) => {
    // 1. Required Fields
    if (!entry.projectName.trim()) return "Project Name is required.";
    if (!entry.techUsed.trim()) return "Tech Stack is required.";
    if (!entry.description.trim()) return "Description is required.";
    if (!entry.startDate) return "Start Date is required.";
    if (!entry.isOngoing && !entry.endDate) return "End Date is required.";

    // 2. Date Logic
    const start = new Date(entry.startDate);
    const end = entry.endDate ? new Date(entry.endDate) : null;
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time

    if (start > now) return "Start date cannot be in the future.";

    if (!entry.isOngoing && end) {
      if (end > now) return "End date cannot be in the future.";
      if (start > end) return "Start date cannot be after End date.";
    }

    // 3. Word Count Validation
    if (entry.description) {
      const wordCount = entry.description
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      if (wordCount > 50) {
        return `Description cannot exceed 50 words (Current: ${wordCount}).`;
      }
    }

    return null; // No errors
  };

  // --- Helper: Count Words ---
  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  // --- Restricted Description Handler ---
  const handleDescChange = (e, isNew = false, index = null) => {
    const val = e.target.value;
    const wordCount = countWords(val);

    // Only allow update if word count <= 50
    if (wordCount <= 50) {
      if (isNew) {
        setNewProject({ ...newProject, description: val });
      } else {
        const copy = [...projects];
        copy[index].description = val;
        setProjects(copy);
      }
    }
    // If > 50, do nothing (reject input)
  };

  const handleEditSave = (index, updated) => {
    setError("");
    const validationError = validateEntry(updated);
    if (validationError) {
      setError(validationError);
      return;
    }

    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updated,
      endDate: updated.isOngoing ? "Present" : updated.endDate,
    };
    setEditingIndex(null);
    autoSave(updatedProjects);
  };

  const handleDelete = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    autoSave(updatedProjects);
  };

  const handleAddSave = () => {
    setError("");
    const validationError = validateEntry(newProject);
    if (validationError) {
      setError(validationError);
      return;
    }

    autoSave([...projects, newProject]);
    setNewProject({
      projectName: "",
      projectLink: "",
      githubLink: "",
      startDate: "",
      endDate: "",
      isOngoing: false,
      description: "",
      techUsed: "",
    });
    setShowAddBox(false);
  };

  const toggleOngoing = (isEditMode, index = null) => {
    if (isEditMode && index !== null) {
      const updated = {
        ...projects[index],
        isOngoing: !projects[index].isOngoing,
      };
      const updatedProjects = [...projects];
      updatedProjects[index] = updated;
      setProjects(updatedProjects);
    } else {
      setNewProject({ ...newProject, isOngoing: !newProject.isOngoing });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* --- Section Header --- */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-gray-800 pb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-[10px] text-gray-500 font-bold font-mono tracking-widest">
          {projects.length < 10 ? `0${projects.length}` : projects.length}{" "}
          ENTRIES
        </span>
      </div>

      {/* --- List of Projects --- */}
      <div className="space-y-6">
        {projects.map((item, i) => (
          <div
            key={i}
            className={`group relative transition-all duration-300 ease-in-out ${
              editingIndex === i ? "mb-8" : ""
            }`}
          >
            {editingIndex === i ? (
              // --- EDIT MODE (Darker/Heavier Container) ---
              <div className="p-8 bg-gray-100 border border-gray-300 rounded-lg space-y-8 animate-slideDown shadow-inner">
                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Editing Project
                  </span>
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setError("");
                    }}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <AiOutlineClose size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MinimalInput
                    label="Project Name"
                    value={item.projectName}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[i].projectName = e.target.value;
                      setProjects(copy);
                    }}
                  />
                  <MinimalInput
                    label="Tech Stack (comma separated)"
                    value={item.techUsed}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[i].techUsed = e.target.value;
                      setProjects(copy);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MinimalInput
                    label="Live Demo Link"
                    value={item.projectLink}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[i].projectLink = e.target.value;
                      setProjects(copy);
                    }}
                    placeholder="https://..."
                  />
                  <MinimalInput
                    label="GitHub Repository"
                    value={item.githubLink}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[i].githubLink = e.target.value;
                      setProjects(copy);
                    }}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <MinimalInput
                    label="Start Date"
                    type="date"
                    max={today}
                    value={item.startDate}
                    onChange={(e) => {
                      const copy = [...projects];
                      copy[i].startDate = e.target.value;
                      setProjects(copy);
                    }}
                  />
                  <div className="flex flex-col pt-1">
                    {!item.isOngoing ? (
                      <MinimalInput
                        label="End Date"
                        type="date"
                        max={today}
                        value={item.endDate}
                        onChange={(e) => {
                          const copy = [...projects];
                          copy[i].endDate = e.target.value;
                          setProjects(copy);
                        }}
                      />
                    ) : (
                      <div className="h-[42px] flex items-end pb-2 border-b border-gray-400">
                        <span className="text-sm font-bold text-gray-400 italic">
                          Present
                        </span>
                      </div>
                    )}

                    {/* Checkbox */}
                    <div
                      className="flex items-center gap-3 mt-4 cursor-pointer group/check w-fit"
                      onClick={() => toggleOngoing(true, i)}
                    >
                      <div
                        className={`w-4 h-4 border-2 transition-colors ${
                          item.isOngoing
                            ? "bg-gray-900 border-gray-900"
                            : "border-gray-400 group-hover/check:border-gray-900"
                        }`}
                      ></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover/check:text-gray-900 transition-colors">
                        Ongoing
                      </span>
                    </div>
                  </div>
                </div>

                {/* Restricted Description */}
                <div>
                  <MinimalTextArea
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleDescChange(e, false, i)}
                    placeholder="Max 50 words..."
                  />
                  <div className="flex justify-end mt-1">
                    <span
                      className={`text-[9px] font-bold tracking-widest ${
                        countWords(item.description) >= 50
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {countWords(item.description)} / 50 WORDS
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    * {error}
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => handleEditSave(i, projects[i])}
                    className="px-8 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-all duration-300 hover:shadow-lg transform active:scale-95"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setError("");
                    }}
                    className="px-6 py-3 border border-gray-400 text-gray-700 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // --- VIEW MODE (Solid Gray Card) ---
              <div className="relative p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        {item.projectName || "Untitled Project"}
                      </h4>

                      {/* Date Pill */}
                      <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-sm">
                        <AiOutlineCalendar />
                        {item.startDate} —{" "}
                        {item.isOngoing ? "Present" : item.endDate}
                      </div>
                    </div>

                    {/* Links Row */}
                    <div className="flex gap-4 mt-2">
                      {item.projectLink && (
                        <a
                          href={item.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors group/link"
                        >
                          <AiOutlineLink />{" "}
                          <span className="underline decoration-transparent group-hover/link:decoration-blue-600 transition-all">
                            Live Demo
                          </span>
                        </a>
                      )}
                      {item.githubLink && (
                        <a
                          href={item.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors group/git"
                        >
                          <AiOutlineGithub />{" "}
                          <span className="underline decoration-transparent group-hover/git:decoration-black transition-all">
                            Source Code
                          </span>
                        </a>
                      )}
                    </div>

                    {/* Tech Stack Pills */}
                    {item.techUsed && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(Array.isArray(item.techUsed)
                          ? item.techUsed
                          : item.techUsed.split(",")
                        ).map(
                          (tech, idx) =>
                            tech && ( // Ensure tech exists
                              <span
                                key={idx}
                                className="text-[9px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-1 rounded-sm"
                              >
                                {/* Handle if tech is string or object just in case, and trim */}
                                {typeof tech === "string" ? tech.trim() : tech}
                              </span>
                            )
                        )}
                      </div>
                    )}

                    {item.description && (
                      <p className="text-sm font-medium text-gray-600 mt-4 leading-relaxed max-w-2xl border-l-2 border-gray-300 pl-4">
                        {item.description}
                      </p>
                    )}

                    {/* Mobile Date */}
                    <p className="md:hidden text-xs text-gray-500 mt-4 font-mono uppercase font-bold">
                      {item.startDate} —{" "}
                      {item.isOngoing ? "Present" : item.endDate}
                    </p>
                  </div>

                  {/* Hover Actions (Floating) */}
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 ml-4">
                    <button
                      onClick={() => setEditingIndex(i)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:text-black hover:border-black transition-all shadow-sm"
                      title="Edit"
                    >
                      <AiOutlineEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:text-red-700 hover:border-red-700 transition-all shadow-sm"
                      title="Delete"
                    >
                      <AiOutlineDelete size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- ADD NEW FORM --- */}
      {showAddBox ? (
        <div className="mt-10 p-8 bg-gray-100 border border-gray-300 rounded-lg space-y-8 animate-slideDown shadow-inner">
          <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
              Add New Project
            </h4>
            <button
              onClick={() => {
                setShowAddBox(false);
                setError("");
              }}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <AiOutlineClose size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Project Name"
              value={newProject.projectName}
              onChange={(e) =>
                setNewProject({ ...newProject, projectName: e.target.value })
              }
              placeholder="Ex. E-Commerce Dashboard"
            />
            <MinimalInput
              label="Tech Stack"
              value={newProject.techUsed}
              onChange={(e) =>
                setNewProject({ ...newProject, techUsed: e.target.value })
              }
              placeholder="Ex. React, Next.js, Stripe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Live Link"
              value={newProject.projectLink}
              onChange={(e) =>
                setNewProject({ ...newProject, projectLink: e.target.value })
              }
              placeholder="https://..."
            />
            <MinimalInput
              label="GitHub Link"
              value={newProject.githubLink}
              onChange={(e) =>
                setNewProject({ ...newProject, githubLink: e.target.value })
              }
              placeholder="https://github.com/..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Start Date"
              type="date"
              max={today}
              value={newProject.startDate}
              onChange={(e) =>
                setNewProject({ ...newProject, startDate: e.target.value })
              }
            />
            <div className="flex flex-col">
              {!newProject.isOngoing ? (
                <MinimalInput
                  label="End Date"
                  type="date"
                  max={today}
                  value={newProject.endDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, endDate: e.target.value })
                  }
                />
              ) : (
                <div className="h-[44px] flex items-end pb-2 border-b border-gray-400">
                  <span className="text-sm font-bold text-gray-400 italic">
                    Present
                  </span>
                </div>
              )}

              <div
                className="flex items-center gap-3 mt-4 cursor-pointer group/check w-fit"
                onClick={() => toggleOngoing(false)}
              >
                <div
                  className={`w-4 h-4 border-2 transition-colors ${
                    newProject.isOngoing
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-400 group-hover/check:border-gray-900"
                  }`}
                ></div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover/check:text-gray-900 transition-colors">
                  Ongoing
                </span>
              </div>
            </div>
          </div>

          {/* Restricted Description */}
          <div>
            <MinimalTextArea
              label="Description"
              value={newProject.description}
              onChange={(e) => handleDescChange(e, true)}
              placeholder="Max 50 words..."
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-[9px] font-bold tracking-widest ${
                  countWords(newProject.description) >= 50
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              >
                {countWords(newProject.description)} / 50 WORDS
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
              * {error}
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleAddSave}
              className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 hover:shadow-lg transform active:scale-[0.98]"
            >
              Confirm Entry
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddBox(true)}
          className="mt-8 w-full py-4 border-2 border-dashed border-gray-300 flex items-center justify-center gap-3 group hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 rounded-lg"
        >
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <AiOutlinePlus size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">
            Add New Project
          </span>
        </button>
      )}
    </div>
  );
}
