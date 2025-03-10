"use client";

import MonthPicker from "./MonthPicker";

export default function Header() {
  return (
    <div className="sticky top-0 z-10 px-4 py-2 bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Financial Overview
        </h1>
        <MonthPicker />
      </div>
    </div>
  );
}
