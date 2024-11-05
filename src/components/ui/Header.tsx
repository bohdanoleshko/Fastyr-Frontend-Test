import React from "react";

export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-xl font-semibold text-gray-800">Fastyr App</div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Hello, User!</span>

      </div>
    </header>
  );
}
