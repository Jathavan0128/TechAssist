// src/components/Tickets/TicketForm.jsx
import { useState } from "react";

export default function TicketForm({
  onSubmit,
  departmentOptions = [],
  priorityOptions = [],
  loading = false,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    priority: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.department || !form.priority) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      department: form.department,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1 - Title + Priority */}
      <div className="flex gap-4">
        {/* Title */}
        <div className="w-2/3">
          <label className="font-medium">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            placeholder="Enter ticket title"
            required
          />
        </div>

        {/* Priority */}
        <div className="w-1/3">
          <label className="font-medium">Priority *</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          >
            <option value="">Select priority</option>
            {priorityOptions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="font-medium">Department *</label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        >
          <option value="">Select department</option>
          {departmentOptions.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          className="w-full border p-2 rounded mt-1"
          placeholder="Describe your issue..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Ticket"}
      </button>
    </form>
  );
}
