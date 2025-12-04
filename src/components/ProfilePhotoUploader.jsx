import React, { useRef } from "react";

export default function ProfilePhotoUploader({ setPhoto }) {
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <button
      type="button"
      onClick={() => fileRef.current.click()}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
    >
      Choose Photo
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </button>
  );
}
