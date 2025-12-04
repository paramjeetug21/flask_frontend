import React from "react";

export default function Loader({ size = 40 }) {
  return (
    <div className="w-full h-screen flex items-center justify-center  p-8 bg-radial from-[#0A0F2C] via-[#1B2A5A] to-black">
      <div
        className="border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
