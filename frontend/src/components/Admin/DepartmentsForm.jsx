import { useEffect, useState } from "react";

export default function DepartmentsForm({ onAdd, onUpdate, editing, onCancel }) {
  const [name, setName] = useState("");

  // Prefill input when editing
  useEffect(() => {
    if (editing) {
      setName(editing.name || "");
    } else {
      setName("");
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (editing) {
      onUpdate(editing._id, name.trim());
    } else {
      onAdd(name.trim());
    }

    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editing ? "Edit Department" : "Add New Department"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Department Name</label>
        <input
          type="text"
          className="mt-1 p-2 border rounded w-full"
          placeholder="Enter department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editing ? "Update" : "Add"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
