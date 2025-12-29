import React from "react";

export default function TopHeader({ title, subtitle, children }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right-side action button slot */}
      {children && <div>{children}</div>}
    </div>
  );
}
