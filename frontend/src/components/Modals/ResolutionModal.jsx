// src/components/Modals/ResolutionModal.jsx
import React from "react";

export default function ResolutionModal({
  ticket,
  resolution,
  setResolution,
  onCancel,
  onSubmit,
  submitting,
}) {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Resolve Ticket</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ticket.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Department: {ticket.department?.name || "Unknown"}
          </p>
        </div>

        {/* Body */}
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Resolution notes
          </label>
          <textarea
            rows={6}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Describe how resolved…"
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          {/* Footer Buttons */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 transition"
            >
              {submitting ? "Resolving…" : "Resolve Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
