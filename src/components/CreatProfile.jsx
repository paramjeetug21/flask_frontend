import { useState } from "react";
import axios from "axios";
import API_URL from "../api/authApi";

export default function CreateProfile({ token, onProfileCreated, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = API_URL;

  // ----------------------------
  // VALIDATION FUNCTIONS
  // ----------------------------
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (num) => {
    return /^[0-9]{10}$/.test(num);
  };

  // ----------------------------
  // AUTO LOCATION USING BROWSER
  // ----------------------------
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // Reverse geocoding using OpenStreetMap (FREE, no API key)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
          const country = data.address.country || "";

          setLocation(`${city}, ${country}`);
        } catch (err) {
          console.error(err);
          alert("Could not fetch location!");
        }
      },
      (err) => {
        console.error(err);
        alert("Permission denied or error fetching location.");
      }
    );
  };

  // ----------------------------
  // SUBMIT FUNCTION
  // ----------------------------
  const handleSubmit = async () => {
    if (!name || !email) {
      alert("Name and Email are required!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const payload = {
      user: token,
      personal: { name, email, designation, location, phone },
    };

    setLoading(true);

    try {
      const res = await axios.post(`${apiUrl}profile/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile created successfully!");
      onProfileCreated(res.data.profile_id);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-amber-200 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl font-bold text-gray-800 hover:text-indigo-500"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Create New Profile
        </h2>

        <div className="space-y-4">
          <InputField
            label="Name"
            value={name}
            onChange={setName}
            placeholder="John Doe"
          />
          <InputField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="john@example.com"
          />
          <InputField
            label="Designation"
            value={designation}
            onChange={setDesignation}
            placeholder="Software Engineer"
          />

          {/* LOCATION + BUTTON */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full p-2 rounded-xl border border-gray-300"
                value={location}
                placeholder="City, Country"
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                onClick={fetchLocation}
                className="px-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
              >
                📍
              </button>
            </div>
          </div>

          <InputField
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="10-digit number"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </div>
    </div>
  );
}

// Input Field Component
function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        className="w-full p-2 rounded-xl border border-gray-300"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
