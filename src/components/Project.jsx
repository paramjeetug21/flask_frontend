import { useState, useEffect } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";

export default function ProjectsSection({
  title = "Projects",
  data = [],
  onChange,
}) {
  const [projects, setProjects] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
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
  const [showAddBox, setShowAddBox] = useState(false);

  useEffect(() => {
    setProjects(data);
  }, [data]);

  const autoSave = (updatedProjects) => {
    setProjects(updatedProjects);
    onChange(updatedProjects);
  };

  const handleEditSave = (index, updated) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updated,
      endDate: updated.isOngoing ? "Present" : updated.endDate,
      techUsed:
        typeof updated.techUsed === "string"
          ? updated.techUsed
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : updated.techUsed,
    };
    setEditingIndex(null);
    autoSave(updatedProjects);
  };

  const handleDelete = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    autoSave(updatedProjects);
  };

  const handleAddSave = () => {
    const projectToAdd = {
      ...newProject,
      endDate: newProject.isOngoing ? "Present" : newProject.endDate,
      techUsed: newProject.techUsed
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    autoSave([...projects, projectToAdd]);
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

  const handleTechChange = (e, index = null) => {
    let val = e.target.value;
    if (val.endsWith(" ")) val = val.trim() + ", ";
    if (index !== null) {
      setProjects((prev) => {
        const copy = [...prev];
        copy[index].techUsed = val;
        return copy;
      });
    } else {
      setNewProject((prev) => ({ ...prev, techUsed: val }));
    }
  };

  return (
    <div className="bg-white/40 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
      <h3 className="text-2xl font-bold text-purple-600 mb-4">{title}</h3>

      {projects.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {projects.map((item, i) => (
            <li
              key={i}
              className="p-4 bg-white/30 rounded-xl shadow flex justify-between items-start"
            >
              {editingIndex === i ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.projectName}
                    onChange={(e) =>
                      setProjects((prev) => {
                        const copy = [...prev];
                        copy[i].projectName = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Project Name"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.projectLink}
                    onChange={(e) =>
                      setProjects((prev) => {
                        const copy = [...prev];
                        copy[i].projectLink = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Project Link"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.githubLink}
                    onChange={(e) =>
                      setProjects((prev) => {
                        const copy = [...prev];
                        copy[i].githubLink = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="GitHub Link"
                  />
                  <input
                    type="date"
                    className="w-full p-2 rounded-xl border"
                    value={item.startDate}
                    onChange={(e) =>
                      setProjects((prev) => {
                        const copy = [...prev];
                        copy[i].startDate = e.target.value;
                        return copy;
                      })
                    }
                  />
                  {!item.isOngoing && (
                    <input
                      type="date"
                      className="w-full p-2 rounded-xl border"
                      value={item.endDate}
                      onChange={(e) =>
                        setProjects((prev) => {
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
                      checked={item.isOngoing}
                      onChange={(e) =>
                        setProjects((prev) => {
                          const copy = [...prev];
                          copy[i].isOngoing = e.target.checked;
                          return copy;
                        })
                      }
                      className="mr-2"
                    />
                    <label className="font-semibold">Ongoing Project</label>
                  </div>
                  <textarea
                    className="w-full p-2 rounded-xl border"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setProjects((prev) => {
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
                      onClick={() => handleEditSave(i, projects[i])}
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
                  <h4 className="text-lg font-bold">{item.projectName}</h4>
                  {item.projectLink && (
                    <p>
                      <strong>Project Link:</strong> {item.projectLink}
                    </p>
                  )}
                  {item.githubLink && (
                    <p>
                      <strong>GitHub:</strong> {item.githubLink}
                    </p>
                  )}
                  <p>
                    <strong>Duration:</strong> {item.startDate} -{" "}
                    {item.isOngoing ? "Present" : item.endDate}
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
        <p className="text-gray-600 mb-6">No projects added.</p>
      )}

      {/* ADD NEW */}
      {showAddBox ? (
        <div className="mt-4 p-4 bg-white/50 rounded-2xl border shadow space-y-3">
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Project Name"
            value={newProject.projectName}
            onChange={(e) =>
              setNewProject({ ...newProject, projectName: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Project Link"
            value={newProject.projectLink}
            onChange={(e) =>
              setNewProject({ ...newProject, projectLink: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="GitHub Link"
            value={newProject.githubLink}
            onChange={(e) =>
              setNewProject({ ...newProject, githubLink: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full p-2 rounded-xl border"
            value={newProject.startDate}
            onChange={(e) =>
              setNewProject({ ...newProject, startDate: e.target.value })
            }
          />
          {!newProject.isOngoing && (
            <input
              type="date"
              className="w-full p-2 rounded-xl border"
              value={newProject.endDate}
              onChange={(e) =>
                setNewProject({ ...newProject, endDate: e.target.value })
              }
            />
          )}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={newProject.isOngoing}
              onChange={(e) =>
                setNewProject({ ...newProject, isOngoing: e.target.checked })
              }
            />
            <label className="font-semibold">Ongoing Project</label>
          </div>
          <textarea
            className="w-full p-2 rounded-xl border"
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Technologies used (comma separated)"
            value={newProject.techUsed}
            onChange={handleTechChange}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddSave}
              className="p-2 bg-purple-600 rounded text-white hover:cursor-pointer"
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
