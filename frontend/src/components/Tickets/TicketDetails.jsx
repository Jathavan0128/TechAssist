import React from "react";
import { formatDate } from "../../utils/format";
import { FiTag, FiClock } from "react-icons/fi";

export default function TicketDetails({ ticket }) {
  if (!ticket) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>

      <p className="text-gray-600 whitespace-pre-line">{ticket.description}</p>

      <div className="flex items-center gap-6 text-sm text-gray-500 pt-3">
        <span className="flex items-center gap-1">
          <FiClock /> {formatDate(ticket.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <FiTag /> {ticket.priority}
        </span>
        <span className="capitalize">{ticket.status}</span>
      </div>
    </div>
  );
}
