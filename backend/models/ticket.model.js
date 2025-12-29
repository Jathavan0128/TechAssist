// src/models/ticket.model.js
import mongoose from "mongoose";

export const TICKET_STATUSES = [
  "Open",
  "In Progress",
  "Pending Review",
  "Escalated",
  "Resolved",
  "Closed",
];

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    status: { type: String, enum: TICKET_STATUSES, default: "Open" },
    priority: { type: mongoose.Schema.Types.ObjectId, ref: "Priority", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.Mixed, default: null },
    resolution: { type: String, default: "", trim: true },
    resolvedAt: { type: Date },
    reviewNotes: { type: String, default: "", trim: true },
    reviewCompletedAt: { type: Date },
    escalatedReason: { type: String, default: "", trim: true },
    escalatedAt: { type: Date },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
