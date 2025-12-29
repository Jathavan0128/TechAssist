import React, { useEffect, useState } from "react";
import { getTicketById, updateTicket } from "../../services/ticketsService";
import { getDepartments } from "../../services/departmentsService";
import { getPriorities } from "../../services/prioritiesService";
import { getUsers } from "../../services/usersService";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminEditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [tRes, dRes, pRes, uRes] = await Promise.all([
          getTicketById(id),
          getDepartments(),
          getPriorities(),
          getUsers(),
        ]);
        if (!mounted) return;
        const ticket = tRes.data;
        setForm({
          title: ticket.title || "",
          description: ticket.description || "",
          status: ticket.status || "Open",
          resolution: ticket.resolution || "",
          assignedTo: ticket.assignedTo || "",
          priority: ticket.priority || "",
          departmentId: ticket.departmentId || "",
        });
        setDepartments(dRes.data || []);
        setPriorities(pRes.data || []);
        setUsers(uRes.data || []);
      } catch {
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="p-6">Loading ticket…</div>;
  if (!form) return <div className="p-6">Ticket not found.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateTicket(id, {
        title: form.title,
        description: form.description,
        status: form.status,
        resolution: form.resolution,
        assignedTo: form.assignedTo,
        departmentId: form.departmentId,
        priority: form.priority,
      });
      navigate(`/admin/tickets/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Ticket</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded">
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Assigned To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded">
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded">
              <option value="">Select priority</option>
              {priorities.map((p) => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Department</label>
            <select name="departmentId" value={form.departmentId} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded">
              <option value="">Select department</option>
              {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Resolution</label>
          <textarea name="resolution" value={form.resolution} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
            {submitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
