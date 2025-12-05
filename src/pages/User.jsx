import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const parsed = JSON.parse(data);
      setUserData(parsed);
      setNewName(parsed.user.name);
      setNewPhoto(parsed.user.profile_photo);
    }
  }, []);

  if (!userData) {
    return (
      <div
        className="min-h-screen p-8 bg-radial from-[#0A0F2C] via-[#1B2A5A] to-black
"
      >
        Loading profile...
      </div>
    );
  }

  const profile = userData;

  // Convert file → base64
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setNewPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        "https://flask-backend-2pd6.onrender.com/auth/update-profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: profile.user.email,
            name: newName,
            profile_photo: newPhoto,
          }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...profile,
          user: {
            ...profile.user,
            name: newName,
            profile_photo: newPhoto,
          },
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setSuccess(true);
        setEditMode(false);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        alert(result.error || "Failed to update!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;

    try {
      const response = await fetch(
        `https://flask-backend-2pd6.onrender.com/auth/delete-profile`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: profile.user.email }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        localStorage.clear();
        navigate("/signup");
        alert("Profile deleted successfully!");
      } else {
        alert(result.error || "Failed to delete profile!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen  p-8 bg-radial from-[#0A0F2C] via-[#1B2A5A] to-black
 flex flex-col items-center py-10 px-4 "
    >
      {/* TOP BUTTONS */}
      <div className="w-full max-w-5xl flex justify-end gap-4 mb-8">
        {/* EDIT BUTTON */}
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 border border-blue-500 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-300 rounded font-semibold text-red-700 hover:bg-red-100"
        >
          Logout
        </button>

        <button
          onClick={handleDeleteProfile}
          className="px-4 py-2 border border-red-500 rounded font-semibold text-white bg-red-600 hover:bg-red-700"
        >
          Delete Profile
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-4 px-4 py-2 bg-green-200 text-green-800 rounded-lg shadow">
          Profile updated successfully!
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT PHOTO */}
        <div className="md:w-1/3 flex flex-col justify-center items-center p-6 relative z-10">
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={newPhoto || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* EDIT MODE PHOTO UPLOAD */}
          {editMode && (
            <label className="mt-3 px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300 cursor-pointer">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-center z-10 space-y-4">
          {/* NAME EDIT SECTION */}
          {!editMode ? (
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800">
              {profile.user.name}
            </h1>
          ) : (
            <>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-3 py-2 rounded-lg text-gray-700 w-full"
                placeholder="Enter name"
              />
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-red-200 text-red-800 rounded-lg hover:bg-red-300"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* EMAIL */}
          <div className="flex flex-wrap gap-4 mt-4">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              {profile.user.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
