import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineRead, // Icon for Education
} from "react-icons/ai";

// --- Helper: Darker Minimal Input ---
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

// --- Helper: Darker Minimal Text Area ---
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

export default function EducationSection({
  title = "Education",
  data = [],
  onChange,
}) {
  const [edus, setEdus] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [error, setError] = useState(""); // New State for Validation Errors

  // New Education State
  const [newEdu, setNewEdu] = useState({
    institution: "",
    degree: "",
    field: "",
    grade: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split("T")[0];

  // --- EFFECT WITH INFINITE LOOP FIX ---
  useEffect(() => {
    setEdus((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        return data;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const autoSave = (updatedEdus) => {
    setEdus(updatedEdus);
    if (onChange) onChange(updatedEdus);
  };

  // --- VALIDATION LOGIC ---
  const validateEntry = (entry) => {
    // 1. Check Required Fields
    if (
      !entry.institution.trim() ||
      !entry.degree.trim() ||
      !entry.field.trim() ||
      !entry.grade.trim() ||
      !entry.startDate
    ) {
      return "All fields (except description) are required.";
    }

    if (!entry.isCurrent && !entry.endDate) {
      return "End date is required unless currently studying.";
    }

    // 2. Date Logic
    const start = new Date(entry.startDate);
    const end = entry.endDate ? new Date(entry.endDate) : null;
    const now = new Date();

    // Reset time to midnight for accurate date comparison
    now.setHours(0, 0, 0, 0);

    if (start > now) {
      return "Start date cannot be in the future.";
    }

    if (!entry.isCurrent && end) {
      if (end > now) {
        return "End date cannot be in the future (select 'Currently Studying').";
      }
      if (start > end) {
        return "Start date cannot be after End date.";
      }
    }

    // 3. Grade Logic (Not > 100)
    const gradeNum = parseFloat(entry.grade);
    if (!isNaN(gradeNum) && gradeNum > 100) {
      return "Grade/Percentage cannot be greater than 100.";
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
        setNewEdu({ ...newEdu, description: val });
      } else {
        const copy = [...edus];
        copy[index].description = val;
        setEdus(copy);
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

    const updatedEdus = [...edus];
    updatedEdus[index] = {
      ...updated,
      endDate: updated.isCurrent ? "Present" : updated.endDate,
    };
    setEditingIndex(null);
    autoSave(updatedEdus);
  };

  const handleDelete = (index) => {
    const updatedEdus = edus.filter((_, i) => i !== index);
    autoSave(updatedEdus);
  };

  const handleAddSave = () => {
    setError("");
    const validationError = validateEntry(newEdu);
    if (validationError) {
      setError(validationError);
      return;
    }

    autoSave([...edus, newEdu]);
    setNewEdu({
      institution: "",
      degree: "",
      field: "",
      grade: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setShowAddBox(false);
  };

  // Checkbox Handler for "Currently Studying"
  const toggleCurrent = (isEditMode, index = null) => {
    if (isEditMode && index !== null) {
      const updated = { ...edus[index], isCurrent: !edus[index].isCurrent };
      const updatedEdus = [...edus];
      updatedEdus[index] = updated;
      setEdus(updatedEdus);
    } else {
      setNewEdu({ ...newEdu, isCurrent: !newEdu.isCurrent });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-gray-800 pb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-[10px] text-gray-500 font-bold font-mono tracking-widest">
          {edus.length < 10 ? `0${edus.length}` : edus.length} ENTRIES
        </span>
      </div>

      {/* List of Education */}
      <div className="space-y-6">
        {edus.map((item, i) => (
          <div
            key={i}
            className={`group relative transition-all duration-300 ${
              editingIndex === i ? "mb-8" : ""
            }`}
          >
            {editingIndex === i ? (
              // --- EDIT MODE (Darker/Heavier Container) ---
              <div className="p-8 bg-gray-100 border border-gray-300 rounded-lg space-y-8 animate-slideDown shadow-inner">
                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Editing Education
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
                    label="Institution"
                    value={item.institution}
                    onChange={(e) => {
                      const copy = [...edus];
                      copy[i].institution = e.target.value;
                      setEdus(copy);
                    }}
                  />
                  <MinimalInput
                    label="Degree"
                    value={item.degree}
                    onChange={(e) => {
                      const copy = [...edus];
                      copy[i].degree = e.target.value;
                      setEdus(copy);
                    }}
                  />
                  <MinimalInput
                    label="Field of Study"
                    value={item.field}
                    onChange={(e) => {
                      const copy = [...edus];
                      copy[i].field = e.target.value;
                      setEdus(copy);
                    }}
                  />
                  <MinimalInput
                    label="Grade / CGPA"
                    value={item.grade}
                    placeholder="Max 100 or CGPA"
                    onChange={(e) => {
                      const copy = [...edus];
                      copy[i].grade = e.target.value;
                      setEdus(copy);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MinimalInput
                    label="Start Date"
                    type="date"
                    max={today}
                    value={item.startDate}
                    onChange={(e) => {
                      const copy = [...edus];
                      copy[i].startDate = e.target.value;
                      setEdus(copy);
                    }}
                  />
                  <div className="flex flex-col">
                    {!item.isCurrent ? (
                      <MinimalInput
                        label="End Date"
                        type="date"
                        max={today}
                        value={item.endDate}
                        onChange={(e) => {
                          const copy = [...edus];
                          copy[i].endDate = e.target.value;
                          setEdus(copy);
                        }}
                      />
                    ) : (
                      <div className="h-[44px] flex items-end pb-2 border-b border-gray-400">
                        <span className="text-sm font-bold text-gray-400 italic">
                          Present
                        </span>
                      </div>
                    )}

                    {/* Checkbox */}
                    <div
                      className="flex items-center gap-3 mt-4 cursor-pointer group/check w-fit"
                      onClick={() => toggleCurrent(true, i)}
                    >
                      <div
                        className={`w-4 h-4 border-2 transition-colors ${
                          item.isCurrent
                            ? "bg-gray-900 border-gray-900"
                            : "border-gray-400 group-hover/check:border-gray-900"
                        }`}
                      ></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover/check:text-gray-900 transition-colors">
                        Currently Studying
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

                {/* Error Message Display */}
                {error && (
                  <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    * {error}
                  </div>
                )}

                {/* Edit Actions */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => handleEditSave(i, edus[i])}
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
                        <AiOutlineRead className="text-gray-400" />
                        {item.institution || "Institution Name"}
                      </h4>

                      {/* Date Pill - Darker */}
                      <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-sm">
                        {item.startDate} —{" "}
                        {item.isCurrent ? "Present" : item.endDate}
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {item.degree}{" "}
                      {item.field && (
                        <>
                          <span className="text-gray-400 mx-2">|</span>
                          {item.field}
                        </>
                      )}
                    </p>

                    {item.grade && (
                      <p className="text-xs text-gray-500 mt-2 font-mono uppercase font-bold">
                        Grade: <span className="text-black">{item.grade}</span>
                      </p>
                    )}

                    {item.description && (
                      <p className="text-sm font-medium text-gray-600 mt-4 leading-relaxed max-w-2xl border-l-2 border-gray-300 pl-4">
                        {item.description}
                      </p>
                    )}

                    {/* Mobile Date */}
                    <p className="md:hidden text-xs text-gray-500 mt-4 font-mono uppercase font-bold">
                      {item.startDate} —{" "}
                      {item.isCurrent ? "Present" : item.endDate}
                    </p>
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
              Add New Education
            </h4>
            <button
              onClick={() => {
                setShowAddBox(false);
                setError("");
              }}
            >
              <AiOutlineClose className="text-gray-500 hover:text-black transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Institution"
              value={newEdu.institution}
              onChange={(e) =>
                setNewEdu({ ...newEdu, institution: e.target.value })
              }
              placeholder="Ex. Harvard University"
            />
            <MinimalInput
              label="Degree"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              placeholder="Ex. Bachelor's"
            />
            <MinimalInput
              label="Field of Study"
              value={newEdu.field}
              onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
              placeholder="Ex. Computer Science"
            />
            <MinimalInput
              label="Grade / CGPA"
              value={newEdu.grade}
              onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
              placeholder="Max 100 or CGPA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Start Date"
              type="date"
              max={today}
              value={newEdu.startDate}
              onChange={(e) =>
                setNewEdu({ ...newEdu, startDate: e.target.value })
              }
            />
            <div className="flex flex-col">
              {!newEdu.isCurrent ? (
                <MinimalInput
                  label="End Date"
                  type="date"
                  max={today}
                  value={newEdu.endDate}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, endDate: e.target.value })
                  }
                />
              ) : (
                <div className="h-[44px] flex items-end pb-2 border-b border-gray-400">
                  <span className="text-sm font-bold text-gray-400 italic">
                    Present
                  </span>
                </div>
              )}

              {/* Checkbox */}
              <div
                className="flex items-center gap-3 mt-4 cursor-pointer group/check w-fit"
                onClick={() => toggleCurrent(false)}
              >
                <div
                  className={`w-4 h-4 border-2 transition-colors ${
                    newEdu.isCurrent
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-400 group-hover/check:border-gray-900"
                  }`}
                ></div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 group-hover/check:text-gray-900 transition-colors">
                  Currently Studying
                </span>
              </div>
            </div>
          </div>

          {/* Restricted Description */}
          <div>
            <MinimalTextArea
              label="Description"
              value={newEdu.description}
              onChange={(e) => handleDescChange(e, true)}
              placeholder="Max 50 words..."
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-[9px] font-bold tracking-widest ${
                  countWords(newEdu.description) >= 50
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              >
                {countWords(newEdu.description)} / 50 WORDS
              </span>
            </div>
          </div>

          {/* Error Message Display */}
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
            Add Education
          </span>
        </button>
      )}
    </div>
  );
}
