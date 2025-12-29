// src/components/Tickets/TicketCard.jsx
import React from "react";

export default function TicketCard({
  ticket,
  onClick,
  onEdit,
  onResolve,
  onDelete,
}) {
  // Priority badge color mapping
  const priorityName =
    typeof ticket.priority === "object"
      ? ticket.priority?.name
      : ticket.priority;

  const priorityColor = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  }[priorityName] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition border border-gray-200"
      onClick={() => onClick?.(ticket)}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {ticket.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
        {ticket.description || "No description provided."}
      </p>

      {/* Info Section */}
      <div className="mt-3 text-sm space-y-1">
        <p>
          <strong className="text-gray-700 dark:text-gray-300">Department:</strong>{" "}
          {ticket.department?.name || "Unknown"}
        </p>

        <p className="flex items-center gap-2">
          <strong className="text-gray-700 dark:text-gray-300">Priority:</strong>
          <span
            className={`px-2 py-0.5 text-xs rounded-full border ${priorityColor}`}
          >
            {priorityName || "Unknown"}
          </span>
        </p>

        <p>
          <strong className="text-gray-700 dark:text-gray-300">Status:</strong>{" "}
          {ticket.status}
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        {/* Edit */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(ticket);
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>

        {/* Resolve */}
        {ticket.status !== "Resolved" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResolve?.(ticket);
            }}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Resolve
          </button>
        )}

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(ticket);
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
