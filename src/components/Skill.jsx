import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineThunderbolt,
} from "react-icons/ai";

// --- Helper: Darker Minimal Input ---
const MinimalInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="relative flex flex-col w-full group">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
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

export default function SkillsSection({
  title = "Skills",
  data = [],
  onChange,
}) {
  const [skillsList, setSkillsList] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({ category: "", skills: "" });
  const [showAddBox, setShowAddBox] = useState(false);

  // --- SAFE EFFECT (Prevents Infinite Loop) ---
  useEffect(() => {
    const processedData = data.map((item) => ({
      ...item,
      skills: item.skills,
    }));

    setSkillsList((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(processedData)) {
        return processedData;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const autoSave = (updatedSkills) => {
    setSkillsList(updatedSkills);
    if (onChange) onChange(updatedSkills);
  };

  const handleEditSave = (index) => {
    const updatedSkills = [...skillsList];

    // Logic: Convert string to array if it's a string (from input)
    updatedSkills[index].skills =
      typeof updatedSkills[index].skills === "string"
        ? updatedSkills[index].skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : updatedSkills[index].skills;

    setEditingIndex(null);
    autoSave(updatedSkills);
  };

  const handleDelete = (index) => {
    const updatedSkills = skillsList.filter((_, i) => i !== index);
    autoSave(updatedSkills);
  };

  const handleAddSave = () => {
    const entryToAdd = {
      category: newEntry.category,
      skills: newEntry.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    autoSave([...skillsList, entryToAdd]);
    setNewEntry({ category: "", skills: "" });
    setShowAddBox(false);
  };

  const handleSkillChange = (e, index = null) => {
    let value = e.target.value;
    // Auto-insert comma on space
    if (value.endsWith(" ")) value = value.trim() + ", ";

    if (index !== null) {
      setSkillsList((prev) => {
        const copy = [...prev];
        copy[index].skills = value;
        return copy;
      });
    } else {
      setNewEntry((prev) => ({ ...prev, skills: value }));
    }
  };

  // Helper to safely render skills in View Mode
  const renderSkillsPills = (skillsData) => {
    const skillsArray = Array.isArray(skillsData)
      ? skillsData
      : typeof skillsData === "string"
      ? skillsData.split(",")
      : [];

    return skillsArray.map(
      (sk, idx) =>
        sk.trim() && (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-[10px] font-bold uppercase tracking-wide rounded-sm border border-gray-300"
          >
            {sk.trim()}
          </span>
        )
    );
  };

  // Helper to get string value for Input Mode
  const getSkillsString = (skillsData) => {
    return Array.isArray(skillsData) ? skillsData.join(", ") : skillsData;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* --- Section Header --- */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-gray-800 pb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-[10px] text-gray-500 font-bold font-mono tracking-widest">
          {skillsList.length < 10 ? `0${skillsList.length}` : skillsList.length}{" "}
          CATEGORIES
        </span>
      </div>

      {/* --- List of Skills --- */}
      <div className="space-y-6">
        {skillsList.map((item, i) => (
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
                    Editing Category
                  </span>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <AiOutlineClose size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <MinimalInput
                    label="Category Name"
                    value={item.category}
                    onChange={(e) => {
                      const copy = [...skillsList];
                      copy[i].category = e.target.value;
                      setSkillsList(copy);
                    }}
                    placeholder="Ex. Frontend, Backend, Tools"
                  />
                  <MinimalInput
                    label="Skills List (comma separated)"
                    value={getSkillsString(item.skills)}
                    onChange={(e) => handleSkillChange(e, i)}
                    placeholder="React, Node.js, Python..."
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => handleEditSave(i)}
                    className="px-8 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-all duration-300 hover:shadow-lg transform active:scale-95"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
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
                    <h4 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-3">
                      <AiOutlineThunderbolt className="text-gray-400" />
                      {item.category || "Uncategorized"}
                    </h4>

                    <div className="flex flex-wrap gap-2 mt-4 pl-7">
                      {renderSkillsPills(item.skills)}
                    </div>
                  </div>

                  {/* Hover Actions */}
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
              Add New Skill Category
            </h4>
            <button onClick={() => setShowAddBox(false)}>
              <AiOutlineClose className="text-gray-500 hover:text-black transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <MinimalInput
              label="Category Name"
              value={newEntry.category}
              onChange={(e) =>
                setNewEntry({ ...newEntry, category: e.target.value })
              }
              placeholder="Ex. Languages, Frameworks, Soft Skills"
            />
            <MinimalInput
              label="Skills (comma separated)"
              value={newEntry.skills}
              onChange={handleSkillChange}
              placeholder="Ex. English, Spanish, Leadership..."
            />
          </div>

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
            Add Skill Category
          </span>
        </button>
      )}
    </div>
  );
}
