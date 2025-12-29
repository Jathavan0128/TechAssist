// src/pages/user/TicketPage.jsx
import React, { useEffect, useState } from "react";
import { getMyTickets, deleteTicket } from "../../services/ticketsService";
import TicketCard from "../../components/Tickets/TicketCard";
import { useNavigate } from "react-router-dom";

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getMyTickets(); // FIXED
      console.log("🔥 My Tickets:", data);

      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("TicketPage load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      load();
    } catch (err) {
      console.error("Ticket delete error:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading tickets…</div>;
  if (!tickets.length) return <div className="p-6">No tickets yet.</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {tickets.map((t) => (
        <TicketCard
          key={t._id}
          ticket={t}
          onClick={() => navigate(`/tickets/${t._id}`)}
          onDelete={() => handleDelete(t._id)}
        />
      ))}
    </div>
  );
}
