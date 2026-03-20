"use client";

import { Menu } from "lucide-react";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header className="h-14 bg-emerald-800 flex items-center px-4 text-white shadow-md">
      <button
        onClick={onToggleSidebar}
        className="mr-4 p-2 rounded hover:bg-emerald-700 transition"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-lg font-semibold tracking-wide">
        Healthcare System
      </h1>
    </header>
  );
}
