import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  getAllTickets,
  updateTicket,
  deleteTicket,
} from "../../services/ticketsService";
import { getDepartments } from "../../services/departmentsService";
import { getPriorities } from "../../services/prioritiesService";

const STATUS_COLORS = {
  Open: "bg-blue-500 text-white",
  "In Progress": "bg-yellow-500 text-black",
  "Pending Review": "bg-indigo-500 text-white",
  Escalated: "bg-red-600 text-white",
  Resolved: "bg-green-600 text-white",
  Closed: "bg-gray-600 text-white",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-400"}`}>
      {status}
    </span>
  );
}

const toast = (msg) => alert(msg);

const getName = (maybeObjOrString) =>
  maybeObjOrString == null
    ? ""
    : typeof maybeObjOrString === "string"
    ? maybeObjOrString
    : maybeObjOrString.name || "";

const getId = (maybeObjOrString) =>
  maybeObjOrString == null
    ? ""
    : typeof maybeObjOrString === "string"
    ? maybeObjOrString
    : maybeObjOrString._id || maybeObjOrString.id || "";

function exportCSV(data = []) {
  const header = ["TicketId", "Title", "Status", "PriorityId", "PriorityName", "DepartmentId", "DepartmentName", "CreatedById", "CreatedByName", "AssignedToId", "AssignedToName", "CreatedAt"];
  const rows = data.map((t) => [
    t._id,
    `"${(t.title || "").replace(/"/g, '""')}"`,
    t.status,
    getId(t.priority),
    `"${getName(t.priority).replace(/"/g, '""')}"`,
    getId(t.department),
    `"${getName(t.department).replace(/"/g, '""')}"`,
    t.createdBy?._id || "",
    `"${t.createdBy?.name || ""}"`,
    t.assignedTo?._id || "",
    `"${t.assignedTo?.name || ""}"`,
    new Date(t.createdAt).toISOString(),
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tickets_export_${Date.now()}.csv`;
  a.click();
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDeptId, setFilterDeptId] = useState("");
  const [filterPriorityId, setFilterPriorityId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, dList, pList] = await Promise.all([
        getAllTickets(),
        getDepartments(),
        getPriorities(),
      ]);
      setTickets(Array.isArray(tList) ? tList : []);
      setDepartments(Array.isArray(dList) ? dList : []);
      setPriorities(Array.isArray(pList) ? pList : []);
    } catch {
      toast("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    return tickets.filter((t) => {
      if (filterDeptId && getId(t.department) !== filterDeptId) return false;
      if (filterPriorityId && getId(t.priority) !== filterPriorityId) return false;
      if (filterStatus && (t.status || "") !== filterStatus) return false;
      if (!q) return true;
      const hay = `${t.title || ""} ${(t.description || "")} ${getName(t.department)} ${getName(t.priority)} ${t.createdBy?.name || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tickets, search, filterDeptId, filterPriorityId, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleStatusChange = async (ticketId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    const payload = { status: newStatus };
    if (newStatus === "Resolved") {
      const notes = window.prompt("Enter resolution notes (optional):", ticketId?.resolution || "");
      if (notes !== null) payload.resolution = notes;
    }
    try {
      const updated = await updateTicket(ticketId, payload);
      setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      toast("Ticket updated");
    } catch {
      toast("Update failed");
    }
  };

  const handleDelete = async (ticket) => {
    if (!window.confirm(`Delete ticket "${ticket.title}"?`)) return;
    try {
      await deleteTicket(ticket._id);
      setTickets((prev) => prev.filter((t) => t._id !== ticket._id));
      toast("Ticket deleted");
    } catch {
      toast("Delete failed");
    }
  };

  const ticketsByDept = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      const name = getName(t.department) || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const ticketsByPriority = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      const name = getName(t.priority) || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const monthlyTrend = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      const d = new Date(t.createdAt);
      if (!isNaN(d)) {
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map[month] = (map[month] || 0) + 1;
      }
    });
    return Object.entries(map).map(([month, value]) => ({ month, value }));
  }, [tickets]);

  if (loading) return <div className="p-6 text-xl">Loading admin dashboard…</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sky-700">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={loadData} className="px-4 py-2 bg-sky-600 text-white rounded">Refresh</button>
          <button onClick={() => exportCSV(filtered)} className="px-4 py-2 bg-green-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search title, description, department, priority, creator..."
            className="border p-2 rounded col-span-2"
          />
          <select value={filterDeptId} onChange={(e) => { setFilterDeptId(e.target.value); setPage(1); }} className="border p-2 rounded">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select value={filterPriorityId} onChange={(e) => { setFilterPriorityId(e.target.value); setPage(1); }} className="border p-2 rounded">
            <option value="">All Priorities</option>
            {priorities.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="border p-2 rounded">
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={() => { setSearch(""); setFilterDeptId(""); setFilterPriorityId(""); setFilterStatus(""); setPage(1); }} className="px-3 py-2 border rounded">Clear</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        {Object.keys(STATUS_COLORS).map((s) => (
          <div key={s} className={`p-4 rounded shadow ${STATUS_COLORS[s].split(" ")[0]}`}>
            <p className="text-sm font-semibold text-white">{s}</p>
            <p className="text-2xl font-bold text-white">{tickets.filter((t) => t.status === s).length}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Tickets by Department</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ticketsByDept} dataKey="value" nameKey="name" outerRadius={80} label>
                  {ticketsByDept.map((_, i) => <Cell key={i} fill={["#4A90E2","#50E3C2","#F5A623","#D0021B","#8B5CF6"][i % 5]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Monthly Trend</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Tickets by Priority</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ticketsByPriority} dataKey="value" nameKey="name" outerRadius={80} label>
                  {ticketsByPriority.map((_, i) => <Cell key={i} fill={["#F5A623","#4A90E2","#D0021B","#417505"][i % 4]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-3">Tickets</h2>

      {paged.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded">No tickets found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paged.map((t) => (
              <article key={t._id} className="bg-white p-4 rounded shadow space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{t.title}</h3>
                    <p className="text-sm text-gray-500">{t.description}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={t.status} />
                    <p className="text-xs text-gray-400 mt-2">{new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p><strong>Ticket ID:</strong> <span className="text-xs text-gray-600">{t._id}</span></p>
                    <p><strong>Department:</strong> {getName(t.department)} <span className="text-xs text-gray-500">({getId(t.department)})</span></p>
                    <p><strong>Priority:</strong> {getName(t.priority)} <span className="text-xs text-gray-500">({getId(t.priority)})</span></p>
                  </div>

                  <div>
                    <p><strong>Created By:</strong> {t.createdBy?.name || "—"} <span className="text-xs text-gray-500">({t.createdBy?._id || ""})</span></p>
                    <p><strong>Assigned To:</strong> {t.assignedTo?.name || "—"} <span className="text-xs text-gray-500">({t.assignedTo?._id || ""})</span></p>
                    <p><strong>Resolution:</strong> <span className="text-sm">{t.resolution || "—"}</span></p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <select value={t.status} onChange={(e) => handleStatusChange(t._id, e.target.value)} className="border p-1 rounded">
                    {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleDelete(t)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  <button onClick={() => { navigator.clipboard?.writeText(t._id); toast("Ticket ID copied"); }} className="px-3 py-1 border rounded">Copy ID</button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              Showing <strong>{(page - 1) * PER_PAGE + 1}</strong>–<strong>{Math.min(page * PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <span className="px-2">Page {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
