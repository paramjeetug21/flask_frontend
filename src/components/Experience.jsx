import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineGlobal,
} from "react-icons/ai";

// --- Helper: Darker Animated Minimal Input ---
const MinimalInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  max,
}) => (
  <div className="relative flex flex-col w-full group">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        max={max}
        className="peer w-full py-2 border-b border-gray-400 bg-transparent outline-none font-medium text-sm placeholder-gray-400 text-gray-900 transition-all focus:border-black"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
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
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-500 ease-out peer-focus:w-full" />
    </div>
  </div>
);

export default function ExperienceSection({
  title = "Experience",
  data = [],
  onChange,
}) {
  const [exps, setExps] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [error, setError] = useState("");

  const initialNewExp = {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    techUsed: "",
  };
  const [newExp, setNewExp] = useState(initialNewExp);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const formattedData = data.map((item) => ({
      ...item,
      techUsed: Array.isArray(item.techUsed)
        ? item.techUsed.join(", ")
        : item.techUsed || "",
    }));

    setExps((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(formattedData)) {
        return formattedData;
      }
      return prev;
    });
  }, [JSON.stringify(data)]);

  const triggerChange = (updatedExps) => {
    const formattedForSave = updatedExps.map((item) => ({
      ...item,
      techUsed:
        typeof item.techUsed === "string"
          ? item.techUsed
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : item.techUsed,
    }));
    if (onChange) onChange(formattedForSave);
  };

  // --- Validation Logic ---
  const validateEntry = (entry) => {
    if (!entry.company.trim()) return "Company Name is required.";
    if (!entry.position.trim()) return "Position/Role is required.";
    if (!entry.startDate) return "Start Date is required.";
    if (!entry.isCurrent && !entry.endDate)
      return "End Date is required unless currently working.";

    const start = new Date(entry.startDate);
    const end = entry.endDate ? new Date(entry.endDate) : null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (start > now) return "Start date cannot be in the future.";
    if (!entry.isCurrent && end) {
      if (end > now)
        return "End date cannot be in the future (select 'Currently Working').";
      if (start > end) return "Start date cannot be after End date.";
    }

    return null;
  };

  // --- Helper: Count Words ---
  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  // --- Restricted Description Handler ---
  // This prevents typing if word count > 50
  const handleDescChange = (e, isNew = false, index = null) => {
    const val = e.target.value;
    const wordCount = countWords(val);

    // Allow update if words <= 50, OR if the user is deleting (val length is getting smaller)
    // Actually, strictly allowing <= 50 is enough. If they delete, count goes down, so it passes.
    if (wordCount <= 50) {
      if (isNew) {
        setNewExp({ ...newExp, description: val });
      } else {
        handleEditChange(index, "description", val);
      }
    }
    // If > 50, we simply ignore the input (it won't type)
  };

  const handleEditChange = (index, field, value) => {
    const updated = [...exps];
    updated[index] = { ...updated[index], [field]: value };
    setExps(updated);
  };

  const handleEditSave = (index) => {
    setError("");
    const item = exps[index];
    const validationError = validateEntry(item);
    if (validationError) {
      setError(validationError);
      return;
    }
    const finalItem = {
      ...item,
      endDate: item.isCurrent ? "" : item.endDate,
    };
    const updated = [...exps];
    updated[index] = finalItem;
    setEditingIndex(null);
    triggerChange(updated);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to remove this experience?")) {
      const updated = exps.filter((_, i) => i !== index);
      setExps(updated);
      triggerChange(updated);
    }
  };

  const handleAddSave = () => {
    setError("");
    const validationError = validateEntry(newExp);
    if (validationError) {
      setError(validationError);
      return;
    }
    const finalNewItem = {
      ...newExp,
      endDate: newExp.isCurrent ? "" : newExp.endDate,
    };
    const updated = [...exps, finalNewItem];
    setExps(updated);
    triggerChange(updated);
    setNewExp(initialNewExp);
    setShowAddBox(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn mb-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-gray-800 pb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-[10px] text-gray-500 font-bold font-mono tracking-widest">
          {exps.length < 10 ? `0${exps.length}` : exps.length} ENTRIES
        </span>
      </div>

      {/* List */}
      <div className="space-y-6">
        {exps.map((item, i) => (
          <div
            key={i}
            className={`group relative transition-all duration-300 ${
              editingIndex === i ? "mb-8" : ""
            }`}
          >
            {editingIndex === i ? (
              // --- EDIT MODE ---
              <div className="p-8 bg-gray-100 border border-gray-300 rounded-lg space-y-8 animate-slideDown shadow-inner">
                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Editing Experience
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
                    label="Company Name"
                    value={item.company}
                    onChange={(e) =>
                      handleEditChange(i, "company", e.target.value)
                    }
                  />
                  <MinimalInput
                    label="Position / Role"
                    value={item.position}
                    onChange={(e) =>
                      handleEditChange(i, "position", e.target.value)
                    }
                  />
                  <MinimalInput
                    label="Location"
                    value={item.location}
                    onChange={(e) =>
                      handleEditChange(i, "location", e.target.value)
                    }
                  />
                  <MinimalInput
                    label="Tech Stack (comma separated)"
                    value={item.techUsed}
                    onChange={(e) =>
                      handleEditChange(i, "techUsed", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MinimalInput
                    label="Start Date"
                    type="date"
                    max={today}
                    value={item.startDate}
                    onChange={(e) =>
                      handleEditChange(i, "startDate", e.target.value)
                    }
                  />

                  <div className="flex flex-col">
                    {!item.isCurrent ? (
                      <MinimalInput
                        label="End Date"
                        type="date"
                        max={today}
                        value={item.endDate}
                        onChange={(e) =>
                          handleEditChange(i, "endDate", e.target.value)
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
                      onClick={() =>
                        handleEditChange(i, "isCurrent", !item.isCurrent)
                      }
                    >
                      <div
                        className={`w-4 h-4 border-2 transition-colors ${
                          item.isCurrent
                            ? "bg-gray-900 border-gray-900"
                            : "border-gray-400 group-hover/check:border-gray-900"
                        }`}
                      />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover/check:text-gray-900 transition-colors">
                        Currently Working
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description with Word Count Restriction */}
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

                {error && (
                  <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    * {error}
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => handleEditSave(i)}
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
              // --- VIEW MODE ---
              <div className="relative p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                        {item.position || "Position Role"}
                      </h4>
                      <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-sm">
                        {item.startDate || "YYYY"} —{" "}
                        {item.isCurrent ? "Present" : item.endDate || "YYYY"}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-sm font-medium text-gray-700 mt-1">
                      <span className="font-bold">{item.company}</span>
                      {item.location && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <AiOutlineGlobal /> {item.location}
                        </span>
                      )}
                    </div>

                    {item.techUsed && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.techUsed.split(",").map(
                          (tech, idx) =>
                            tech.trim() && (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-sm uppercase tracking-wider"
                              >
                                {tech.trim()}
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

                    <p className="md:hidden text-xs text-gray-500 mt-4 font-mono uppercase font-bold">
                      {item.startDate || "YYYY"} —{" "}
                      {item.isCurrent ? "Present" : item.endDate || "YYYY"}
                    </p>
                  </div>

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
              Add New Experience
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
              label="Company Name"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              placeholder="Ex. Google"
            />
            <MinimalInput
              label="Position / Role"
              value={newExp.position}
              onChange={(e) =>
                setNewExp({ ...newExp, position: e.target.value })
              }
              placeholder="Ex. Senior Engineer"
            />
            <MinimalInput
              label="Location"
              value={newExp.location}
              onChange={(e) =>
                setNewExp({ ...newExp, location: e.target.value })
              }
              placeholder="Ex. San Francisco, CA"
            />
            <MinimalInput
              label="Tech Stack (comma separated)"
              value={newExp.techUsed}
              onChange={(e) =>
                setNewExp({ ...newExp, techUsed: e.target.value })
              }
              placeholder="Ex. React, Node.js, AWS"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Start Date"
              type="date"
              max={today}
              value={newExp.startDate}
              onChange={(e) =>
                setNewExp({ ...newExp, startDate: e.target.value })
              }
            />
            <div className="flex flex-col">
              {!newExp.isCurrent ? (
                <MinimalInput
                  label="End Date"
                  type="date"
                  max={today}
                  value={newExp.endDate}
                  onChange={(e) =>
                    setNewExp({ ...newExp, endDate: e.target.value })
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
                onClick={() =>
                  setNewExp({ ...newExp, isCurrent: !newExp.isCurrent })
                }
              >
                <div
                  className={`w-4 h-4 border-2 transition-colors ${
                    newExp.isCurrent
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-400 group-hover/check:border-gray-900"
                  }`}
                />
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover/check:text-gray-900 transition-colors">
                  Currently Working
                </span>
              </div>
            </div>
          </div>

          {/* Description with Word Count Restriction */}
          <div>
            <MinimalTextArea
              label="Description"
              value={newExp.description}
              onChange={(e) => handleDescChange(e, true)}
              placeholder="Max 50 words..."
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-[9px] font-bold tracking-widest ${
                  countWords(newExp.description) >= 50
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              >
                {countWords(newExp.description)} / 50 WORDS
              </span>
            </div>
          </div>

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
            Add Professional Experience
          </span>
        </button>
      )}
    </div>
  );
}
