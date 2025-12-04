import { useState, useEffect } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";

export default function SkillsSection({
  title = "Skills",
  data = [],
  onChange,
}) {
  const [skillsList, setSkillsList] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newEntry, setNewEntry] = useState({ category: "", skills: "" });
  const [showAddBox, setShowAddBox] = useState(false);

  useEffect(() => {
    setSkillsList(data);
  }, [data]);

  const autoSave = (updatedSkills) => {
    setSkillsList(updatedSkills);
    onChange(updatedSkills);
  };

  const handleEditSave = (index) => {
    const updatedSkills = [...skillsList];
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

  return (
    <div className="bg-white/40 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
      <h3 className="text-2xl font-bold text-purple-600 mb-4">{title}</h3>

      {skillsList.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {skillsList.map((item, i) => (
            <li
              key={i}
              className="p-4 bg-white/30 rounded-xl shadow flex justify-between items-start"
            >
              {editingIndex === i ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    placeholder="Category"
                    value={item.category}
                    onChange={(e) => {
                      const copy = [...skillsList];
                      copy[i].category = e.target.value;
                      setSkillsList(copy);
                    }}
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    placeholder="Skills (comma separated)"
                    value={item.skills}
                    onChange={(e) => handleSkillChange(e, i)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(i)}
                      className="p-1 bg-green-500 rounded text-white hover:cursor-pointer "
                    >
                      <AiOutlineCheck />
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="p-1 bg-red-500 rounded text-white hover:cursor-pointer"
                    >
                      <AiOutlineClose />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <h4 className="text-lg font-bold">{item.category}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-500/20 text-blue-700 rounded-xl text-sm border border-blue-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {editingIndex !== i && (
                <div className="flex flex-col gap-2 ml-4 mt-1">
                  <button
                    onClick={() => setEditingIndex(i)}
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
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-6">No skills added.</p>
      )}

      {showAddBox ? (
        <div className="mt-4 p-4 bg-white/50 rounded-2xl border shadow space-y-3">
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Category"
            value={newEntry.category}
            onChange={(e) =>
              setNewEntry({ ...newEntry, category: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Skills (comma separated)"
            value={newEntry.skills}
            onChange={handleSkillChange}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddSave}
              className="p-2 bg-blue-600 rounded text-white hover:cursor-pointer"
            >
              <AiOutlineCheck />
            </button>
            <button
              onClick={() => setShowAddBox(false)}
              className="p-2 bg-red-500 rounded text-white hover:cursor-pointer"
            >
              <AiOutlineClose />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddBox(true)}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl hover:cursor-pointer"
        >
          <AiOutlinePlusCircle />
        </button>
      )}
    </div>
  );
}
