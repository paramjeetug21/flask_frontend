import { useState, useEffect } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";

export default function ExperienceSection({
  title = "Experience",
  data = [],
  onChange,
}) {
  const [exps, setExps] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newExp, setNewExp] = useState({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    techUsed: "",
  });
  const [showAddBox, setShowAddBox] = useState(false);

  useEffect(() => {
    setExps(data);
  }, [data]);

  const autoSave = (updatedExps) => {
    setExps(updatedExps);
    onChange(updatedExps);
  };

  const handleEditSave = (index, updated) => {
    const updatedExps = [...exps];
    updatedExps[index] = {
      ...updated,
      endDate: updated.isCurrent ? "Present" : updated.endDate,
      techUsed:
        typeof updated.techUsed === "string"
          ? updated.techUsed
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : updated.techUsed,
    };
    setEditingIndex(null);
    autoSave(updatedExps);
  };

  const handleDelete = (index) => {
    const updatedExps = exps.filter((_, i) => i !== index);
    autoSave(updatedExps);
  };

  const handleAddSave = () => {
    const expToAdd = {
      ...newExp,
      endDate: newExp.isCurrent ? "Present" : newExp.endDate,
      techUsed: newExp.techUsed
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    autoSave([...exps, expToAdd]);
    setNewExp({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      techUsed: "",
    });
    setShowAddBox(false);
  };

  const handleTechChange = (e, index = null) => {
    let val = e.target.value;
    if (val.endsWith(" ")) val = val.trim() + ", ";
    if (index !== null) {
      setExps((prev) => {
        const copy = [...prev];
        copy[index].techUsed = val;
        return copy;
      });
    } else {
      setNewExp((prev) => ({ ...prev, techUsed: val }));
    }
  };

  return (
    <div className="bg-white/40 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
      <h3 className="text-2xl font-bold text-purple-600 mb-4">{title}</h3>

      {exps.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {exps.map((item, i) => (
            <li
              key={i}
              className="p-4 bg-white/30 rounded-xl shadow flex justify-between items-start"
            >
              {editingIndex === i ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.company}
                    onChange={(e) =>
                      setExps((prev) => {
                        const copy = [...prev];
                        copy[i].company = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.position}
                    onChange={(e) =>
                      setExps((prev) => {
                        const copy = [...prev];
                        copy[i].position = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Position"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.location}
                    onChange={(e) =>
                      setExps((prev) => {
                        const copy = [...prev];
                        copy[i].location = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Location"
                  />
                  <input
                    type="date"
                    className="w-full p-2 rounded-xl border"
                    value={item.startDate}
                    onChange={(e) =>
                      setExps((prev) => {
                        const copy = [...prev];
                        copy[i].startDate = e.target.value;
                        return copy;
                      })
                    }
                  />
                  {!item.isCurrent && (
                    <input
                      type="date"
                      className="w-full p-2 rounded-xl border"
                      value={item.endDate}
                      onChange={(e) =>
                        setExps((prev) => {
                          const copy = [...prev];
                          copy[i].endDate = e.target.value;
                          return copy;
                        })
                      }
                    />
                  )}
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={item.isCurrent}
                      onChange={(e) =>
                        setExps((prev) => {
                          const copy = [...prev];
                          copy[i].isCurrent = e.target.checked;
                          return copy;
                        })
                      }
                      className="mr-2"
                    />
                    <label className="font-semibold">Currently Working</label>
                  </div>
                  <textarea
                    className="w-full p-2 rounded-xl border"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setExps((prev) => {
                        const copy = [...prev];
                        copy[i].description = e.target.value;
                        return copy;
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    placeholder="Technologies used (comma separated)"
                    value={item.techUsed}
                    onChange={(e) => handleTechChange(e, i)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(i, exps[i])}
                      className="p-1 bg-green-500 rounded text-white hover:cursor-pointer"
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
                  <h4 className="text-lg font-bold">{item.company}</h4>
                  <p>
                    <strong>Position:</strong> {item.position}
                  </p>
                  <p>
                    <strong>Location:</strong> {item.location}
                  </p>
                  <p>
                    <strong>Duration:</strong> {item.startDate} -{" "}
                    {item.isCurrent ? "Present" : item.endDate}
                  </p>
                  {item.description && (
                    <p>
                      <strong>Description:</strong> {item.description}
                    </p>
                  )}
                  {item.techUsed && (
                    <p>
                      <strong>Tech Used:</strong> {item.techUsed.join(", ")}
                    </p>
                  )}
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
        <p className="text-gray-600 mb-6">No experience added.</p>
      )}

      {/* ADD NEW */}
      {showAddBox ? (
        <div className="mt-4 p-4 bg-white/50 rounded-2xl border shadow space-y-3">
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Company"
            value={newExp.company}
            onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Position"
            value={newExp.position}
            onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Location"
            value={newExp.location}
            onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 rounded-xl border"
            value={newExp.startDate}
            onChange={(e) =>
              setNewExp({ ...newExp, startDate: e.target.value })
            }
          />
          {!newExp.isCurrent && (
            <input
              type="date"
              className="w-full p-2 rounded-xl border"
              value={newExp.endDate}
              onChange={(e) =>
                setNewExp({ ...newExp, endDate: e.target.value })
              }
            />
          )}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={newExp.isCurrent}
              onChange={(e) =>
                setNewExp({ ...newExp, isCurrent: e.target.checked })
              }
            />
            <label className="font-semibold">Currently Working</label>
          </div>
          <textarea
            className="w-full p-2 rounded-xl border"
            placeholder="Description"
            value={newExp.description}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Technologies used (comma separated)"
            value={newExp.techUsed}
            onChange={(e) => handleTechChange(e)}
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
