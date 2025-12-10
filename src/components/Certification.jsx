import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLink,
  AiOutlineCalendar,
  AiOutlineTrophy,
} from "react-icons/ai";
import axios from "axios";
import API_URL from "../api/authApi";

// --- Helper: Darker Animated Minimal Input ---
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

export default function CertificationSection({
  title = "Certifications",
  data = [],
  onChange,
  profileId,
  token,
}) {
  const [certs, setCerts] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddBox, setShowAddBox] = useState(false);
  const [error, setError] = useState(""); // Validation Error State

  // New Cert State
  const [newCert, setNewCert] = useState({
    certificationName: "",
    issuer: "",
    issueDate: "",
    certificateURL: "",
  });

  const apiUrl = API_URL;
  // Get today's date for max attribute
  const today = new Date().toISOString().split("T")[0];

  // --- SAFE EFFECT (Prevents Infinite Loop) ---
  useEffect(() => {
    // Only update state if the stringified data actually changes
    setCerts((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        return data;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  const autoSave = async (updatedCerts) => {
    setCerts(updatedCerts);
    if (onChange) onChange(updatedCerts);

    // --- API CALL ---
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

  // --- VALIDATION LOGIC ---
  const validateEntry = (entry) => {
    if (!entry.certificationName.trim())
      return "Certification Name is required.";
    if (!entry.issuer.trim()) return "Issuer is required.";
    if (!entry.issueDate) return "Issue Date is required.";
    if (!entry.certificateURL.trim()) return "Credential URL is required.";

    // Date Check
    if (new Date(entry.issueDate) > new Date()) {
      return "Issue date cannot be in the future.";
    }

    return null;
  };

  const handleEditSave = (index, updated) => {
    setError("");
    const validationError = validateEntry(updated);
    if (validationError) {
      setError(validationError);
      return;
    }

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
    setError("");
    const validationError = validateEntry(newCert);
    if (validationError) {
      setError(validationError);
      return;
    }

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
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      {/* --- Section Header --- */}
      <div className="flex items-end justify-between mb-8 border-b-2 border-gray-800 pb-4">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-[10px] text-gray-500 font-bold font-mono tracking-widest">
          {certs.length < 10 ? `0${certs.length}` : certs.length} ENTRIES
        </span>
      </div>

      {/* --- List of Certifications --- */}
      <div className="space-y-6">
        {certs.map((item, i) => (
          <div
            key={i}
            className={`group relative transition-all duration-300 ease-in-out ${
              editingIndex === i ? "mb-8" : ""
            }`}
          >
            {editingIndex === i ? (
              // --- EDIT MODE ---
              <div className="p-8 bg-gray-100 border border-gray-300 rounded-lg space-y-8 animate-slideDown shadow-inner">
                <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Editing Certification
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
                    label="Certification Name"
                    value={item.certificationName}
                    onChange={(e) => {
                      const copy = [...certs];
                      copy[i].certificationName = e.target.value;
                      setCerts(copy);
                    }}
                  />
                  <MinimalInput
                    label="Issuer / Organization"
                    value={item.issuer}
                    onChange={(e) => {
                      const copy = [...certs];
                      copy[i].issuer = e.target.value;
                      setCerts(copy);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MinimalInput
                    label="Issue Date"
                    type="date"
                    max={today}
                    value={item.issueDate}
                    onChange={(e) => {
                      const copy = [...certs];
                      copy[i].issueDate = e.target.value;
                      setCerts(copy);
                    }}
                  />
                  <MinimalInput
                    label="Credential URL"
                    value={item.certificateURL}
                    onChange={(e) => {
                      const copy = [...certs];
                      copy[i].certificateURL = e.target.value;
                      setCerts(copy);
                    }}
                    placeholder="https://..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    * {error}
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => handleEditSave(i, certs[i])}
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
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <AiOutlineTrophy className="text-gray-400" size={16} />
                        {item.certificationName || "Certificate Name"}
                      </h4>

                      {/* Date Pill */}
                      {item.issueDate && (
                        <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-200 px-3 py-1 rounded-sm">
                          <AiOutlineCalendar />
                          {item.issueDate}
                        </div>
                      )}
                    </div>

                    <p className="text-sm font-medium text-gray-700 mt-2 pl-7 flex items-center gap-1">
                      Issued by{" "}
                      <span className="font-bold text-black">
                        {item.issuer || "Unknown"}
                      </span>
                    </p>

                    {/* Link */}
                    {item.certificateURL && (
                      <div className="pl-7 mt-3">
                        <a
                          href={item.certificateURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors group/link"
                        >
                          <AiOutlineLink />
                          <span className="underline decoration-transparent group-hover/link:decoration-black transition-all">
                            View Credential
                          </span>
                        </a>
                      </div>
                    )}

                    {/* Mobile Date */}
                    <p className="md:hidden text-xs text-gray-500 mt-4 pl-7 font-mono uppercase font-bold">
                      Issued: {item.issueDate}
                    </p>
                  </div>

                  {/* Hover Actions (Floating) */}
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
              Add New Certification
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
              label="Certification Name"
              value={newCert.certificationName}
              onChange={(e) =>
                setNewCert({ ...newCert, certificationName: e.target.value })
              }
              placeholder="Ex. AWS Certified Solutions Architect"
            />
            <MinimalInput
              label="Issuer"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert({ ...newCert, issuer: e.target.value })
              }
              placeholder="Ex. Amazon Web Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MinimalInput
              label="Issue Date"
              type="date"
              max={today}
              value={newCert.issueDate}
              onChange={(e) =>
                setNewCert({ ...newCert, issueDate: e.target.value })
              }
            />
            <MinimalInput
              label="Credential URL"
              value={newCert.certificateURL}
              onChange={(e) =>
                setNewCert({ ...newCert, certificateURL: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          {/* Error Message */}
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
            Add Certification
          </span>
        </button>
      )}
    </div>
  );
}
