// src/layouts/AdminTopbar.jsx
import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b p-3 flex justify-between items-center">
      <div className="text-xl font-semibold">TechAssist Admin</div>
      <div className="flex items-center gap-3">
        <div className="text-sm">{user?.name}</div>
        <button onClick={onLogout} className="px-3 py-1 bg-red-100 text-red-600 rounded">Logout</button>
      </div>
    </header>
  );
}
