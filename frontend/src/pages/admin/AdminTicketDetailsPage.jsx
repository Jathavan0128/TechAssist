import React, { useEffect, useState } from "react";
import { getTicketById, deleteTicket } from "../../services/ticketsService";
import { useNavigate, useParams } from "react-router-dom";
import TicketDetails from "../../components/Tickets/TicketDetails";

export default function AdminTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getTicketById(id);
      setTicket(res.data);
    } catch {
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      navigate("/admin/tickets");
    } catch {
      alert("Failed to delete ticket");
    }
  };

  if (loading) return <div className="p-6">Loading ticket…</div>;
  if (!ticket) return <div className="p-6">Ticket not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <div className="text-sm text-gray-500">
            Created by: {ticket.createdBy?.name || "—"} • {new Date(ticket.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => navigate(`/admin/tickets/${id}/edit`)} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>

      <TicketDetails ticket={ticket} />
    </div>
  );
}
