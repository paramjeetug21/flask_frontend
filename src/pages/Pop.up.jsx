import React from "react";

const InfoPopup = ({ message }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex items-start gap-3 min-w-[320px] max-w-md p-5 rounded-xl border backdrop-blur-md shadow-lg animate-slide-in bg-green-50/90 border-green-200 text-green-900">
      {/* Success Icon */}
      <div className="mt-1 p-1 rounded-full bg-green-100">
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg leading-tight mb-1">Hey !</h3>
        <p className="text-sm opacity-90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default InfoPopup;
