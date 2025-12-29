// src/components/Admin/TicketsTable.jsx

export default function TicketsTable({ tickets, onDelete, onUpdate }) {
  const handleStatusChange = (ticket, newStatus) => {
    onUpdate(ticket._id, { status: newStatus });
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b font-semibold text-gray-700">
            <th className="p-2">Title</th>
            <th className="p-2">User</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Department</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t._id} className="border-b hover:bg-gray-50">

              <td className="p-2">{t.title}</td>
              <td className="p-2">{t.createdBy?.name || "Unknown"}</td>
              <td className="p-2">{t.priority?.name || "N/A"}</td>
              <td className="p-2">{t.department?.name || "N/A"}</td>

              <td className="p-2">
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>

              <td className="p-2 flex gap-3 justify-center">
                <button className="text-blue-600 hover:underline">View</button>

                <button
                  onClick={() => onDelete(t._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
