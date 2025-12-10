import React from "react";

// ==========================================
// 1. SKELETON CARD (Matches PortfolioCard structure exactly)
// ==========================================
const SkeletonCard = () => {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col h-full animate-pulse">
      {/* --- Main Body (Matches p-4 pt-6 gap-3) --- */}
      <div className="p-4 flex items-start gap-3 pt-6">
        {/* Avatar: Matches w-12 h-12 */}
        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700/50 flex-shrink-0" />

        {/* Text Column */}
        <div className="flex-1 min-w-0 pt-0.5 space-y-2">
          {/* Name Title (Matches text-base) */}
          <div className="h-4 bg-zinc-800 rounded w-3/4" />

          {/* Designation (Matches text-xs) */}
          <div className="h-3 bg-zinc-800/60 rounded w-1/2" />

          {/* Location (Matches text-[10px] mb-3) */}
          <div className="flex items-center gap-1 pt-1 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <div className="h-2.5 bg-zinc-800/40 rounded w-1/3" />
          </div>

          {/* Skills Chips (Matches gap-1.5 and text-[9px] height) */}
          <div className="flex flex-wrap gap-1.5">
            <div className="h-5 w-12 bg-zinc-800 rounded" />
            <div className="h-5 w-8 bg-zinc-800 rounded" />
            <div className="h-5 w-16 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>

      {/* --- Footer (Matches px-4 py-2 mt-auto) --- */}
      <div className="mt-auto border-t border-zinc-800/50 px-4 py-2 bg-zinc-950/30 flex justify-between items-center">
        {/* Share Menu Placeholder */}
        <div className="h-3 w-16 bg-zinc-800 rounded" />

        {/* Action Buttons (Matches w-6 h-6 gap-2) */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800" />
          <div className="w-6 h-6 rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN LOADER PAGE
// ==========================================
export default function Loader() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header Skeleton */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-30 opacity-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="h-8 w-32 bg-zinc-900 rounded animate-pulse" />
          <div className="h-10 w-32 bg-zinc-900 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title Skeleton */}
        <div className="mb-10 flex items-end justify-between border-b border-zinc-900 pb-4 animate-pulse">
          <div className="space-y-3 w-full">
            <div className="h-8 w-64 bg-zinc-900 rounded" />
            <div className="h-4 w-96 bg-zinc-900/50 rounded" />
          </div>
        </div>

        {/* THE GRID:
          - lg:grid-cols-4 (Forces 4 items per row)
          - gap-5 (Matches the tighter spacing)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Generate 8 cards to fill 2 rows perfectly */}
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
