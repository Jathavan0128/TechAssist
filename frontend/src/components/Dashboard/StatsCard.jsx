import React from "react";

export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm text-gray-500">{title}</h4>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>

        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
