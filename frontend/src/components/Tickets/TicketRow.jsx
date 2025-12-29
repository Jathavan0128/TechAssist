import React from "react";
import { formatDate } from "../../utils/format";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TicketRow({ ticket, onOpen, onEdit, onDelete }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="p-3">{ticket.title}</td>
      <td className="p-3 capitalize">{ticket.priority}</td>
      <td className="p-3 capitalize">{ticket.status}</td>
      <td className="p-3">{formatDate(ticket.createdAt)}</td>

      <td className="p-3 text-right flex justify-end gap-3">
        <button
          onClick={() => onOpen(ticket)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FiEye />
        </button>
        <button
          onClick={() => onEdit(ticket)}
          className="text-green-600 hover:text-green-800"
        >
          <FiEdit2 />
        </button>
        <button
          onClick={() => onDelete(ticket)}
          className="text-red-600 hover:text-red-800"
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
}
