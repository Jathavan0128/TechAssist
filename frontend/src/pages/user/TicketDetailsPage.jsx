// src/pages/user/TicketDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { getTicketById, deleteTicket } from "../../services/ticketsService";
import { useParams, useNavigate } from "react-router-dom";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getTicketById(id);

        if (!mounted) return;

        setTicket(data); // already populated
      } catch (err) {
        console.error("TicketDetails load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      navigate("/tickets");
    } catch (err) {
      console.error("Ticket delete error:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading ticket…</div>;
  if (!ticket) return <div className="p-6">Ticket not found.</div>;

  /* ===========================================
     Priority Badge Color
     =========================================== */
  const priorityName =
    typeof ticket.priority === "object"
      ? ticket.priority?.name
      : ticket.priority;

  const priorityColor = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  }[priorityName] || "bg-gray-100 text-gray-700 border-gray-300";

  /* ===========================================
     Status Badge Color
     =========================================== */
  const statusColorMap = {
    Open: "bg-blue-100 text-blue-700 border-blue-300",
    "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-300",
    "Pending Review": "bg-yellow-100 text-yellow-700 border-yellow-300",
    Escalated: "bg-red-100 text-red-700 border-red-300",
    Resolved: "bg-green-100 text-green-700 border-green-300",
    Closed: "bg-gray-200 text-gray-700 border-gray-400",
  };

  const statusColor =
    statusColorMap[ticket.status] ||
    "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* TITLE + META */}
      <div>
        <h1 className="text-3xl font-bold mb-1">{ticket.title}</h1>

        <div className="text-sm text-gray-500">
          Created by:{" "}
          <span className="font-medium">
            {ticket.createdBy?.name || "Unknown"}
          </span>{" "}
          • {new Date(ticket.createdAt).toLocaleString()}
        </div>
      </div>

      {/* STATUS + PRIORITY + DEPARTMENT */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <span
            className={`px-2 py-1 text-xs rounded-full border ${statusColor}`}
          >
            {ticket.status}
          </span>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Priority:</span>
          <span
            className={`px-2 py-1 text-xs rounded-full border ${priorityColor}`}
          >
            {priorityName || "Unknown"}
          </span>
        </div>

        {/* Department */}
        <div>
          <span className="font-semibold">Department:</span>{" "}
          {ticket.department?.name || "Unknown"}
        </div>

        {/* Assigned To */}
        <div>
          <span className="font-semibold">Assigned to:</span>{" "}
          {ticket.assignedTo?.name || "Unassigned"}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="whitespace-pre-line text-gray-700">
          {ticket.description || "No description provided."}
        </p>
      </div>

      {/* WORKFLOW DETAILS */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <h2 className="text-lg font-semibold mb-2">Workflow</h2>

        {ticket.resolution && (
          <p>
            <strong>Resolution:</strong> {ticket.resolution}
          </p>
        )}

        {ticket.escalatedReason && (
          <p>
            <strong>Escalation Reason:</strong> {ticket.escalatedReason}
          </p>
        )}

        {ticket.reviewNotes && (
          <p>
            <strong>Review Notes:</strong> {ticket.reviewNotes}
          </p>
        )}

        {/* Workflow Timestamps */}
        <div className="text-sm text-gray-600 space-y-1">
          {ticket.escalatedAt && (
            <p>Escalated at: {new Date(ticket.escalatedAt).toLocaleString()}</p>
          )}
          {ticket.resolvedAt && (
            <p>Resolved at: {new Date(ticket.resolvedAt).toLocaleString()}</p>
          )}
          {ticket.reviewCompletedAt && (
            <p>
              Review completed:{" "}
              {new Date(ticket.reviewCompletedAt).toLocaleString()}
            </p>
          )}
          {ticket.closedAt && (
            <p>Closed at: {new Date(ticket.closedAt).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/tickets/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
