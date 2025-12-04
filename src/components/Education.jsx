import { useState, useEffect } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";

export default function EducationSection({
  title = "Education",
  data = [],
  onChange,
}) {
  const [edus, setEdus] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
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
  const [showAddBox, setShowAddBox] = useState(false);

  useEffect(() => {
    setEdus(data);
  }, [data]);

  const autoSave = (updatedEdus) => {
    setEdus(updatedEdus);
    onChange(updatedEdus);
  };

  const handleEditSave = (index, updated) => {
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

  return (
    <div className="bg-white/40 p-6 rounded-2xl backdrop-blur-lg shadow-lg">
      <h3 className="text-2xl font-bold text-purple-600 mb-4">{title}</h3>

      {edus.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {edus.map((item, i) => (
            <li
              key={i}
              className="p-4 bg-white/30 rounded-xl shadow flex justify-between items-start"
            >
              {editingIndex === i ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.institution}
                    onChange={(e) =>
                      setEdus((prev) => {
                        const copy = [...prev];
                        copy[i].institution = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Institution / University"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.degree}
                    onChange={(e) =>
                      setEdus((prev) => {
                        const copy = [...prev];
                        copy[i].degree = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.field}
                    onChange={(e) =>
                      setEdus((prev) => {
                        const copy = [...prev];
                        copy[i].field = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Field of Study"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.grade}
                    onChange={(e) =>
                      setEdus((prev) => {
                        const copy = [...prev];
                        copy[i].grade = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Grade / CGPA"
                  />
                  <input
                    type="date"
                    className="w-full p-2 rounded-xl border"
                    value={item.startDate}
                    onChange={(e) =>
                      setEdus((prev) => {
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
                        setEdus((prev) => {
                          const copy = [...prev];
                          copy[i].endDate = e.target.value;
                          return copy;
                        })
                      }
                    />
                  )}
                  <textarea
                    className="w-full p-2 rounded-xl border"
                    value={item.description}
                    onChange={(e) =>
                      setEdus((prev) => {
                        const copy = [...prev];
                        copy[i].description = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Description"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(i, edus[i])}
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
                  <h4 className="text-lg font-bold">{item.institution}</h4>
                  <p>
                    <strong>Degree:</strong> {item.degree}
                  </p>
                  <p>
                    <strong>Field:</strong> {item.field}
                  </p>
                  <p>
                    <strong>Grade:</strong> {item.grade}
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
        <p className="text-gray-600 mb-6">No education added.</p>
      )}

      {/* ADD NEW */}
      {showAddBox ? (
        <div className="mt-4 p-4 bg-white/50 rounded-2xl border shadow space-y-3">
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Institution / University"
            value={newEdu.institution}
            onChange={(e) =>
              setNewEdu({ ...newEdu, institution: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Degree"
            value={newEdu.degree}
            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Field of Study"
            value={newEdu.field}
            onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Grade / CGPA"
            value={newEdu.grade}
            onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 rounded-xl border"
            value={newEdu.startDate}
            onChange={(e) =>
              setNewEdu({ ...newEdu, startDate: e.target.value })
            }
          />
          {!newEdu.isCurrent && (
            <input
              type="date"
              className="w-full p-2 rounded-xl border"
              value={newEdu.endDate}
              onChange={(e) =>
                setNewEdu({ ...newEdu, endDate: e.target.value })
              }
            />
          )}
          <textarea
            className="w-full p-2 rounded-xl border"
            placeholder="Description"
            value={newEdu.description}
            onChange={(e) =>
              setNewEdu({ ...newEdu, description: e.target.value })
            }
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
