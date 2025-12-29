// src/pages/user/UserDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Legend
} from "recharts";

import { getMyTickets, deleteTicket } from "../../services/ticketsService";
import TicketCard from "../../components/Tickets/TicketCard";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a4de6c", "#4b7bec"];

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getMyTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load user tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const counts = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === "Open").length,
    inProgress: tickets.filter(t => t.status === "In Progress").length,
    pending: tickets.filter(t => t.status === "Pending Review").length,
    escalated: tickets.filter(t => t.status === "Escalated").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
    closed: tickets.filter(t => t.status === "Closed").length,
  }), [tickets]);

  const filteredTickets = useMemo(() => {
    const text = search.toLowerCase();
    return tickets
      .filter((t) => filterStatus === "All" || t.status === filterStatus)
      .filter(
        (t) =>
          t.title.toLowerCase().includes(text) ||
          t.description?.toLowerCase().includes(text)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tickets, search, filterStatus]);

  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const paginatedTickets = filteredTickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const ticketsByStatus = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      map[t.status] = (map[t.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const ticketsByPriority = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      const label = t.priority?.name || "Unknown";
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const ticketsByDept = useMemo(() => {
    const map = {};
    tickets.forEach((t) => {
      const dept = t.department?.name || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const monthlyTrend = useMemo(() => {
    const map = {};
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    tickets.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([key, count]) => {
      const [y, m] = key.split("-");
      return { month: `${months[m - 1]} ${y}`, count };
    });
  }, [tickets]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete ticket");
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading tickets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <button onClick={loadTickets} className="px-3 py-1 bg-blue-500 text-white rounded">
          Refresh ⟳
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard label="Total" value={counts.total} color="text-gray-800" />
        <StatCard label="Open" value={counts.open} color="text-blue-600" />
        <StatCard label="In Progress" value={counts.inProgress} color="text-yellow-600" />
        <StatCard label="Pending Review" value={counts.pending} color="text-indigo-600" />
        <StatCard label="Escalated" value={counts.escalated} color="text-red-600" />
        <StatCard label="Resolved" value={counts.resolved} color="text-green-600" />
        <StatCard label="Closed" value={counts.closed} color="text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ChartCard title="By Status">
          <PieChartFixed data={ticketsByStatus} />
        </ChartCard>
        <ChartCard title="By Priority">
          <PieChartFixed data={ticketsByPriority} />
        </ChartCard>
        <ChartCard title="By Department">
          <PieChartFixed data={ticketsByDept} />
        </ChartCard>
        <ChartCard title="Monthly Trend">
          <BarChartFixed data={monthlyTrend} />
        </ChartCard>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          className="border p-2 rounded w-full md:w-1/2"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full md:w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">My Tickets</h2>

        {paginatedTickets.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-gray-600">
            No tickets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedTickets.map((t) => (
              <TicketCard
                key={t._id}
                ticket={t}
                onClick={() => (window.location.href = `/tickets/${t._id}`)}
                onEdit={() => (window.location.href = `/tickets/${t._id}/edit`)}
                onDelete={() => handleDelete(t._id)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold ${color || ""}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow min-h-[300px]">
      <h3 className="font-semibold mb-3 text-center">{title}</h3>
      <div className="w-full h-[260px] flex items-center justify-center">{children}</div>
    </div>
  );
}

function PieChartFixed({ data }) {
  return (
    <PieChart width={260} height={260}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

function BarChartFixed({ data }) {
  return (
    <BarChart width={260} height={260} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#4b7bec" />
    </BarChart>
  );
}
