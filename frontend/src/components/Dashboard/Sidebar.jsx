// src/components/Dashboard/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { HiLockClosed, HiUserCircle } from "react-icons/hi";

export default function Sidebar({ onClose = () => {} }) {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded transition
     hover:bg-gray-100 
     ${isActive ? "bg-gray-100 font-semibold text-indigo-600" : "text-gray-700"}`;

  const avatarLetter = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <nav className="h-full overflow-y-auto bg-white border-r select-none">

      {/* User Profile Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg">
          {avatarLetter}
        </div>
        <div>
          <div className="font-medium leading-tight">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      </div>

      <div className="p-2">

        {/* USER MAIN ROUTES */}
        <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
          Dashboard
        </NavLink>

        <NavLink to="/tickets" className={linkClass} onClick={onClose}>
          Tickets
        </NavLink>

        <NavLink to="/tickets/create" className={linkClass} onClick={onClose}>
          Create Ticket
        </NavLink>

        {/* ACCOUNT SECTION */}
        <div className="px-4 mt-6 mb-1 text-xs text-gray-400 uppercase">
          Account
        </div>

        <NavLink to="/profile-settings" className={linkClass} onClick={onClose}>
          <HiUserCircle className="text-indigo-600" />
          Profile Settings
        </NavLink>

        <NavLink to="/change-password" className={linkClass} onClick={onClose}>
          <HiLockClosed className="text-indigo-600" />
          Change Password
        </NavLink>

        {/* ADMIN SECTION */}
        {user?.role === "admin" && (
          <>
            <div className="px-4 mt-6 mb-1 text-xs text-gray-400 uppercase">
              Admin
            </div>

            <NavLink to="/admin" className={linkClass} onClick={onClose}>
              Admin Dashboard
            </NavLink>

            <NavLink to="/admin/tickets" className={linkClass} onClick={onClose}>
              All Tickets
            </NavLink>

            <NavLink to="/admin/departments" className={linkClass} onClick={onClose}>
              Departments
            </NavLink>

            <NavLink to="/admin/priorities" className={linkClass} onClick={onClose}>
              Priorities
            </NavLink>

            <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
              Users
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
