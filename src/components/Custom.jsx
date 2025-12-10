import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineUnorderedList, // Icon for Custom Section
  AiOutlineLink,
  AiOutlineCheck,
} from "react-icons/ai";

// --- Helper: Darker Animated Minimal Input ---
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

// --- Helper: Darker Minimal Select ---
const MinimalSelect = ({ label, value, onChange, options }) => (
  <div className="relative flex flex-col w-full group">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-black">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="peer w-full py-2 border-b border-gray-400 bg-transparent outline-none font-medium text-sm text-gray-900 transition-all appearance-none cursor-pointer focus:border-black"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Animated Underline */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-500 ease-out peer-focus:w-full" />
    </div>
  </div>
);

export default function SectionList({ data = [], onChange }) {
  const [sections, setSections] = useState(data);
  const [showAddBox, setShowAddBox] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Form State
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [content, setContent] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  // --- SAFE EFFECT (Prevents Infinite Loop) ---
  useEffect(() => {
    setSections((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        return data;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const triggerChange = (updatedSections) => {
    setSections(updatedSections);
    if (onChange) onChange(updatedSections);
  };

  const handleAddOption = () => setDropdownOptions([...dropdownOptions, ""]);

  const handleOptionChange = (value, index) => {
    const updated = [...dropdownOptions];
    updated[index] = value;
    setDropdownOptions(updated);
  };

  const resetForm = () => {
    setFieldName("");
    setFieldType("text");
    setContent("");
    setDropdownOptions([""]);
    setShowAddBox(false);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!fieldName.trim()) return alert("Section name is required!");

    let finalContent = content;
    if (fieldType === "dropdown")
      finalContent = dropdownOptions.filter(Boolean);

    const newSection = {
      name: fieldName,
      type: fieldType,
      content: finalContent,
    };

    let updatedSections;
    if (editingIndex !== null) {
      updatedSections = sections.map((item, idx) =>
        idx === editingIndex ? newSection : item
      );
    } else {
      updatedSections = [...sections, newSection];
    }

    triggerChange(updatedSections);
    resetForm();
  };

  const handleDelete = (index) => {
    const updatedSections = sections.filter((_, idx) => idx !== index);
    triggerChange(updatedSections);
  };

  const handleEdit = (index) => {
    const item = sections[index];
    setFieldName(item.name);
    setFieldType(item.type);
    setContent(
      item.type === "dropdown"
        ? ""
        : Array.isArray(item.content)
        ? item.content.join(", ")
        : item.content
    );
    setDropdownOptions(item.type === "dropdown" ? item.content : [""]);
    setShowAddBox(true);
    setEditingIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* --- Section Header --- */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-gray-800 pb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          Custom Sections
        </h3>
        <span className="text-[10px] text-gray-500 font-bold font-mono tracking-widest">
          {sections.length < 10 ? `0${sections.length}` : sections.length}{" "}
          SECTIONS
        </span>
      </div>

      {/* --- Existing Sections List --- */}
      <div className="space-y-6">
        {sections.map((item, i) => (
          <div
            key={i}
            className={`group relative transition-all duration-300 ease-in-out ${
              // If we are currently editing this specific item, hide it from view list
              editingIndex === i ? "hidden" : "block"
            }`}
          >
            {/* --- VIEW MODE CARD --- */}
            <div className="relative p-6 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex items-center gap-3">
                    <AiOutlineUnorderedList className="text-gray-400" />
                    <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                      {item.name || "Untitled Section"}
                    </h4>
                  </div>

                  {/* Content Display Logic */}
                  <div className="mt-3 pl-7">
                    {Array.isArray(item.content) ? (
                      // Dropdown/List Display
                      <div className="flex flex-wrap gap-2">
                        {item.content.map((opt, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-sm uppercase tracking-wider"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    ) : item.type === "url" ? (
                      // URL Display
                      <a
                        href={item.content}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black hover:underline transition-all"
                      >
                        <AiOutlineLink /> {item.content}
                      </a>
                    ) : (
                      // Text/Textarea/Date Display
                      <p className="text-sm font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 ml-4">
                  <button
                    onClick={() => handleEdit(i)}
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
          </div>
        ))}
      </div>

      {/* --- Add/Edit Box --- */}
      {showAddBox ? (
        <div className="mt-10 p-8 bg-gray-100 border border-gray-300 rounded-lg space-y-8 animate-slideDown shadow-inner">
          <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
              {editingIndex !== null ? "Edit Section" : "Add Custom Section"}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <AiOutlineClose size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Section Name"
              placeholder="e.g. Languages, Hobbies, References"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <MinimalSelect
              label="Input Type"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              options={[
                { value: "text", label: "Text (Single Line)" },
                { value: "textarea", label: "Text Area (Paragraph)" },
                { value: "url", label: "URL / Link" },
                { value: "date", label: "Date" },
                { value: "dropdown", label: "List / Dropdown" },
              ]}
            />
          </div>

          {/* Dynamic Content Inputs */}
          <div className="animate-fadeIn">
            {(fieldType === "text" || fieldType === "url") && (
              <MinimalInput
                label="Content"
                placeholder={`Enter your ${fieldType}...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            )}

            {fieldType === "textarea" && (
              <MinimalTextArea
                label="Content"
                placeholder="Enter description..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            )}

            {fieldType === "date" && (
              <div className="w-full md:w-1/2">
                <MinimalInput
                  label="Date Value"
                  type="date"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            )}

            {fieldType === "dropdown" && (
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  List Items
                </label>
                <div className="space-y-3">
                  {dropdownOptions.map((op, idx) => (
                    <div key={idx} className="flex items-end gap-2">
                      <span className="text-xs font-mono text-gray-400 w-4 pb-3">
                        {idx + 1}.
                      </span>
                      <MinimalInput
                        label=""
                        value={op}
                        onChange={(e) =>
                          handleOptionChange(e.target.value, idx)
                        }
                        placeholder={`Item ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddOption}
                  className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2 transition-colors"
                >
                  <AiOutlinePlus /> Add Item
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-all duration-300 hover:shadow-lg transform active:scale-95"
            >
              {editingIndex !== null ? "Update Section" : "Confirm Section"}
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-400 text-gray-700 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
            >
              Cancel
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
            Add Custom Section
          </span>
        </button>
      )}
    </div>
  );
}
