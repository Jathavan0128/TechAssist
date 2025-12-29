import { useEffect, useState } from "react";
import DepartmentsForm from "../../components/Admin/DepartmentsForm";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentsService";

export default function DepartmentsManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      const list = res.data?.data || [];
      setDepartments(Array.isArray(list) ? list : []);
    } catch {
      setError("Failed to load departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreate = async (name) => {
    try {
      const res = await createDepartment({ name });
      const newDept = res.data?.data;
      setDepartments((prev) => [...prev, newDept]);
    } catch {
      alert("Failed to create department");
    }
  };

  const handleUpdate = async (id, name) => {
    try {
      const res = await updateDepartment(id, { name });
      const updatedDept = res.data?.data;
      setDepartments((prev) =>
        prev.map((d) => (d._id === id ? updatedDept : d))
      );
      setEditing(null);
    } catch {
      alert("Failed to update department");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this department?")) return;
    try {
      await deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Failed to delete department");
    }
  };

  if (loading) return <div className="p-6">Loading departments...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Manage Departments</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <DepartmentsForm
        onAdd={handleCreate}
        editing={editing}
        onUpdate={handleUpdate}
        onCancel={() => setEditing(null)}
      />

      <div className="mt-6 bg-white rounded-xl shadow p-6">
        {departments.length === 0 ? (
          <p className="text-gray-500">No departments found.</p>
        ) : (
          <ul className="space-y-2">
            {departments.map((d) => (
              <li
                key={d._id}
                className="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
              >
                <span className="font-medium">{d.name}</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditing(d)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d._id)}
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
