import React, { useEffect, useState } from "react";
import { getAllTickets } from "../../services/ticketsService";
import api from "../../api/axios";
import TicketCard from "../../components/Tickets/TicketCard";

export default function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const res = await getAllTickets();
      setTickets(res.data || []);
    } catch {}
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/tickets/stats");
      setStats(res.data || {});
    } catch {}
  };

  useEffect(() => {
    Promise.all([loadTickets(), loadStats()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading admin panel…</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="text-gray-600">System overview and management tools</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Open Tickets</h3>
          <p className="text-3xl font-bold mt-2">{stats.open}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">In Progress</h3>
          <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Resolved</h3>
          <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Recent Tickets</h2>

        {tickets.length === 0 ? (
          <div className="p-6 bg-white rounded-xl shadow text-gray-500">
            No tickets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.slice(0, 6).map((t) => (
              <TicketCard
                key={t._id}
                ticket={t}
                onClick={() => (window.location.href = `/admin/tickets/${t._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
