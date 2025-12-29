import { useEffect, useState } from "react";

export default function PrioritiesForm({ onAdd, editing, onUpdate, onCancel }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
    } else {
      setName("");
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name required");

    if (editing) {
      onUpdate(editing._id, name.trim());
    } else {
      onAdd(name.trim());
    }

    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-3 items-center">
      <input
        className="border p-2 rounded flex-1"
        placeholder="Priority name (ex: High)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        {editing ? "Update" : "Add"}
      </button>

      {editing && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
