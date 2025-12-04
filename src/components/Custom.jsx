import { useState } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { HiOutlineCollection } from "react-icons/hi";

export default function SectionList({ data = [], onChange }) {
  const [showAddBox, setShowAddBox] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [content, setContent] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

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
      updatedSections = data.map((item, idx) =>
        idx === editingIndex ? newSection : item
      );
    } else {
      updatedSections = [...data, newSection];
    }

    onChange(updatedSections);
    resetForm();
  };

  const handleDelete = (index) =>
    onChange(data.filter((_, idx) => idx !== index));

  const handleEdit = (index) => {
    const item = data[index];
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
    <div className="bg-white/40 p-6 rounded-2xl backdrop-blur-xl shadow-lg">
      <h3 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
        Custom Sections
      </h3>

      {/* Existing Sections List */}
      {data.length > 0 ? (
        <ul className="space-y-3 mb-6">
          {data.map((item, i) => (
            <li
              key={i}
              className="p-4 bg-white/30 rounded-xl flex justify-between items-start shadow-sm"
            >
              <div>
                <p>
                  <span className="font-semibold">Name:</span> {item.name}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {item.type}
                </p>
                <p>
                  <span className="font-semibold">Content:</span>{" "}
                  {Array.isArray(item.content)
                    ? item.content.join(", ")
                    : item.content}
                </p>
              </div>

              <div className="flex flex-col gap-2 ml-4 mt-1">
                <button
                  onClick={() => handleEdit(i)}
                  className="p-1 bg-yellow-500 rounded text-white text-sm hover:cursor-pointer"
                >
                  <AiFillEdit />
                </button>

                <button
                  onClick={() => handleDelete(i)}
                  className="p-1 bg-red-500 rounded text-white text-sm hover:cursor-pointer"
                >
                  <AiFillDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-6">No custom sections added.</p>
      )}

      {/* Add Button */}
      {!showAddBox && (
        <button
          onClick={() => setShowAddBox(true)}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl hover:bg-indigo-600 flex items-center gap-2 hover:cursor-pointer"
        >
          <AiOutlinePlusCircle className="text-xl" />
        </button>
      )}

      {/* Add/Edit Box */}
      {showAddBox && (
        <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-white/40 shadow-lg space-y-3">
          {/* Section Name */}
          <div>
            <label className="font-semibold text-gray-700">Section Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded-xl border"
              placeholder="e.g., Languages"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </div>

          {/* Field Type */}
          <div>
            <label className="font-semibold text-gray-700">Type</label>
            <select
              className="w-full mt-1 p-2 rounded-xl border"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="url">URL</option>
              <option value="date">Date</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>

          {/* Dynamic Inputs */}
          {(fieldType === "text" ||
            fieldType === "textarea" ||
            fieldType === "url") && (
            <textarea
              className="w-full p-2 rounded-xl border"
              placeholder="Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          {fieldType === "date" && (
            <input
              type="date"
              className="w-full p-2 rounded-xl border"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}

          {fieldType === "dropdown" && (
            <div className="space-y-2">
              {dropdownOptions.map((op, idx) => (
                <input
                  key={idx}
                  value={op}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  className="w-full p-2 rounded-xl border"
                  placeholder={`Option ${idx + 1}`}
                />
              ))}
              <button
                onClick={handleAddOption}
                className="px-4 py-1 bg-purple-600 text-white rounded-xl hover:bg-blue-600 flex items-center gap-1 hover:cursor-pointer"
              >
                <AiOutlinePlusCircle />
              </button>
            </div>
          )}

          {/* Save / Cancel Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer"
            >
              <AiOutlineCheck className="text-xl" />{" "}
              {editingIndex !== null ? "Update" : "Save"}
            </button>

            <button
              onClick={resetForm}
              className="px-5 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center gap-2 hover:cursor-pointer"
            >
              <AiOutlineClose className="text-xl" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
