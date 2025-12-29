import { useEffect, useState } from "react";
import PrioritiesForm from "../../components/Admin/PrioritiesForm";
import {
  getPriorities,
  createPriority,
  updatePriority,
  deletePriority,
} from "../../services/prioritiesService";

export default function PrioritiesManagement() {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const loadPriorities = async () => {
    try {
      const res = await getPriorities();
      setPriorities(res.data || []);
    } catch {
      setError("Failed to load priorities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriorities();
  }, []);

  const handleCreate = async (name) => {
    try {
      await createPriority({ name });
      loadPriorities();
    } catch {
      alert("Failed to create priority");
    }
  };

  const handleUpdate = async (id, name) => {
    try {
      await updatePriority(id, { name });
      setEditing(null);
      loadPriorities();
    } catch {
      alert("Failed to update priority");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this priority?")) return;
    try {
      await deletePriority(id);
      loadPriorities();
    } catch {
      alert("Failed to delete priority");
    }
  };

  if (loading) return <div className="p-6">Loading priorities...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Manage Priorities</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <PrioritiesForm
        onAdd={handleCreate}
        editing={editing}
        onUpdate={handleUpdate}
        onCancel={() => setEditing(null)}
      />

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        {priorities.length === 0 ? (
          <p className="text-gray-500">No priorities found.</p>
        ) : (
          <ul className="space-y-2">
            {priorities.map((p) => (
              <li
                key={p._id}
                className="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
              >
                <span className="font-medium">{p.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditing(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
