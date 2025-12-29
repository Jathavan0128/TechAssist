import React, { useState, useEffect } from "react";
import { HiMenu, HiLogout, HiUserCircle, HiKey } from "react-icons/hi";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Topbar({ onMenuToggle }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const avatar = user?.name?.[0]?.toUpperCase() || "?";

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b flex items-center px-4 shadow-sm relative">
      <button
        className="md:hidden mr-3 text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onMenuToggle();
        }}
      >
        <HiMenu size={24} />
      </button>

      <h1 className="text-xl font-semibold flex-1 select-none">TechAssist</h1>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
          onClick={() => setOpen((prev) => !prev)}
        >
          {avatar}
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 animate-fadeIn z-50">
            <div className="px-4 py-3 border-b dark:border-gray-600">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>

            <Link
              to="/profile-settings"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm rounded transition"
              onClick={() => setOpen(false)}
            >
              <HiUserCircle /> Profile Settings
            </Link>

            <Link
              to="/change-password"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm rounded transition"
              onClick={() => setOpen(false)}
            >
              <HiKey /> Change Password
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 rounded text-sm transition"
            >
              <HiLogout /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
