import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      <Topbar onMenuToggle={() => setSidebarOpen(true)} />

      <div className="flex flex-1 relative min-h-0">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 
            bg-white dark:bg-gray-800 border-r shadow-lg
            transform 
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
            md:static md:translate-x-0 md:opacity-100
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-6 md:ml-0 min-h-[calc(100vh-64px)]">
          <div className="min-h-[600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
