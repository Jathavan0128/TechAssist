// src/components/Admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => `block px-4 py-3 rounded hover:bg-gray-100 ${isActive ? "bg-gray-100 font-semibold" : "text-gray-700"}`;

export default function AdminSidebar() {
  return (
    <nav className="h-full overflow-y-auto bg-white border-r p-3">
      <div className="mb-4 text-lg font-semibold">Admin</div>
      <NavLink to="/admin" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/admin/tickets" className={linkClass}>Tickets</NavLink>
      <NavLink to="/admin/departments" className={linkClass}>Departments</NavLink>
      <NavLink to="/admin/priorities" className={linkClass}>Priorities</NavLink>
      <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
      <NavLink to="/admin/settings" className={linkClass}>Settings</NavLink>
    </nav>
  );
}
