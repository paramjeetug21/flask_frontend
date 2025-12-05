import { useState, useEffect } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import axios from "axios";
import API_URL from "../api/authApi";

export default function CertificationSection({
  title = "Certifications",
  data = [],
  onChange,
  profileId,
  token,
}) {
  const [certs, setCerts] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newCert, setNewCert] = useState({
    certificationName: "",
    issuer: "",
    issueDate: "",
    certificateURL: "",
  });
  const [showAddBox, setShowAddBox] = useState(false);
  const apiUrl = API_URL;
  useEffect(() => {
    setCerts(data);
  }, [data]);

  const autoSave = async (updatedCerts) => {
    setCerts(updatedCerts);
    onChange(updatedCerts);
    try {
      await axios.put(
        `${apiUrl}profile/${profileId}`,
        { certifications: updatedCerts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  };

  const handleEditSave = (index, updated) => {
    const updatedCerts = [...certs];
    updatedCerts[index] = updated;
    setEditingIndex(null);
    autoSave(updatedCerts);
  };

  const handleDelete = (index) => {
    const updatedCerts = certs.filter((_, i) => i !== index);
    autoSave(updatedCerts);
  };

  const handleAddSave = () => {
    const updatedCerts = [...certs, newCert];
    autoSave(updatedCerts);
    setNewCert({
      certificationName: "",
      issuer: "",
      issueDate: "",
      certificateURL: "",
    });
    setShowAddBox(false);
  };

  return (
    <div className="bg-white/40 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
      <h3 className="text-2xl font-bold text-purple-600 mb-4">{title}</h3>

      {certs.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {certs.map((item, i) => (
            <li
              key={i}
              className="p-4 bg-white/40 rounded-xl shadow flex justify-between items-start"
            >
              {editingIndex === i ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.certificationName}
                    onChange={(e) =>
                      setCerts((prev) => {
                        const copy = [...prev];
                        copy[i].certificationName = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Certification Name"
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.issuer}
                    onChange={(e) =>
                      setCerts((prev) => {
                        const copy = [...prev];
                        copy[i].issuer = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Issuer"
                  />
                  <input
                    type="date"
                    className="w-full p-2 rounded-xl border"
                    value={item.issueDate}
                    onChange={(e) =>
                      setCerts((prev) => {
                        const copy = [...prev];
                        copy[i].issueDate = e.target.value;
                        return copy;
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded-xl border"
                    value={item.certificateURL}
                    onChange={(e) =>
                      setCerts((prev) => {
                        const copy = [...prev];
                        copy[i].certificateURL = e.target.value;
                        return copy;
                      })
                    }
                    placeholder="Certificate URL"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(i, certs[i])}
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
                  <h4 className="text-lg font-bold">
                    {item.certificationName}
                  </h4>
                  <p>
                    <strong>Issuer:</strong> {item.issuer}
                  </p>
                  <p>
                    <strong>Issued On:</strong> {item.issueDate}
                  </p>
                  {item.certificateURL && (
                    <a
                      href={item.certificateURL}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 ml-4 mt-1">
                {editingIndex !== i && (
                  <>
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
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-6">No certifications added.</p>
      )}

      {/* ADD NEW */}
      {showAddBox ? (
        <div className="mt-4 p-4 bg-white/50 rounded-2xl border shadow space-y-3">
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Certification Name"
            value={newCert.certificationName}
            onChange={(e) =>
              setNewCert({ ...newCert, certificationName: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Issuer"
            value={newCert.issuer}
            onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 rounded-xl border"
            value={newCert.issueDate}
            onChange={(e) =>
              setNewCert({ ...newCert, issueDate: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 rounded-xl border"
            placeholder="Certificate URL"
            value={newCert.certificateURL}
            onChange={(e) =>
              setNewCert({ ...newCert, certificateURL: e.target.value })
            }
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddSave}
              className="p-2 bg-blue-600 rounded text-white"
            >
              Save
            </button>
            <button
              onClick={() => setShowAddBox(false)}
              className="p-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddBox(true)}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl hover:cursor-pointer"
        >
          <AiOutlinePlusCircle className="text-xl" />
        </button>
      )}
    </div>
  );
}
