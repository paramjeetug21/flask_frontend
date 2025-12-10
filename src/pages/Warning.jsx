import React from "react";

const WarningPopup = ({ message, onConfirm, onCancel }) => {
  // Check if there are any actions to show
  const hasActions = onConfirm || onCancel;

  return (
    <>
      {/* 1. INVISIBLE BACKDROP: Covers the whole screen behind the popup */}
      {/* Clicking this layer triggers the cancel action */}
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={() => onCancel && onCancel()}
      />

      {/* 2. THE POPUP CARD */}
      <div
        // Added onClick={(e) => e.stopPropagation()} so clicking INSIDE the card doesn't close it
        onClick={(e) => e.stopPropagation()}
        className="fixed top-5 right-5 z-50 flex flex-col gap-3 min-w-[320px] max-w-md p-5 rounded-xl border backdrop-blur-md shadow-lg animate-slide-in bg-red-50/90 border-red-200 text-red-900"
      >
        {/* Header Section */}
        <div className="flex items-start gap-3">
          {/* Warning Icon */}
          <div className="mt-1 p-1 rounded-full bg-red-100">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-1">
              Attention Needed
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Button Group */}
        {hasActions && (
          <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-red-200/50">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}

            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm rounded-lg transition-colors"
              >
                Yes, Proceed
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default WarningPopup;
