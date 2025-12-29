// controllers/ticketController.js
import mongoose from "mongoose";
import Ticket, { TICKET_STATUSES } from "../models/ticket.model.js";
import Priority from "../models/priority.model.js";
import User from "../models/user.model.js";
import Department from "../models/department.model.js";

import {
  sendTicketCreated,
  sendTicketAssigned,
  sendTicketResolved,
  sendTicketUpdated,
} from "../utils/emailService.js";

const isValidObjectId = (id) =>
  Boolean(id) && mongoose.Types.ObjectId.isValid(id);

const populateConfig = [
  { path: "priority", select: "name" },
  { path: "department", select: "name" },
  { path: "createdBy", select: "name email" },
  { path: "assignedTo", select: "name email" },
];

const populateTicket = (id) =>
  Ticket.findById(id).populate(populateConfig);

/* CREATE TICKET */
export const createTicket = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description = "", priority, department, assignedTo } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!isValidObjectId(priority) || !isValidObjectId(department)) {
      return res.status(400).json({ message: "Invalid reference ID" });
    }

    const [dept, prio] = await Promise.all([
      Department.findById(department),
      Priority.findById(priority),
    ]);

    if (!dept || !prio) {
      return res.status(400).json({ message: "Invalid department or priority" });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      priority,
      department,
      createdBy: userId,
      assignedTo: isValidObjectId(assignedTo) ? assignedTo : null,
      status: "Open",
    });

    const populated = await populateTicket(ticket._id).lean();
    populated.resolution ||= "";

    try {
      const owner = await User.findById(userId).lean();
      if (owner) await sendTicketCreated?.(populated, owner);

      if (assignedTo && isValidObjectId(assignedTo)) {
        const assignee = await User.findById(assignedTo).lean();
        if (assignee) {
          await sendTicketAssigned?.(populated, assignee, owner);
        }
      }
    } catch {}

    return res.status(201).json(populated);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* GET MY TICKETS */
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tickets = await Ticket.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate(populateConfig)
      .lean();

    tickets.forEach((t) => (t.resolution ||= ""));
    return res.json(tickets);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* GET ALL TICKETS */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .populate(populateConfig)
      .lean();

    tickets.forEach((t) => (t.resolution ||= ""));
    return res.json(tickets);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* GET TICKET BY ID */
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await populateTicket(id).lean();
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.resolution ||= "";
    return res.json(ticket);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE TICKET */
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const updates = req.body;

    if (updates.priority && !isValidObjectId(updates.priority)) {
      return res.status(400).json({ message: "Invalid priority ID" });
    }
    if (updates.department && !isValidObjectId(updates.department)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }
    if (updates.assignedTo && !isValidObjectId(updates.assignedTo)) {
      return res.status(400).json({ message: "Invalid assigned user ID" });
    }

    if (updates.status) {
      if (!TICKET_STATUSES.includes(updates.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      if (updates.status === "Resolved") {
        ticket.resolvedAt = new Date();
        ticket.resolution = updates.resolution || ticket.resolution;
      }

      ticket.status = updates.status;
    }

    ["title", "description", "priority", "department", "assignedTo", "resolution"].forEach(
      (field) => {
        if (updates[field] !== undefined) {
          ticket[field] = updates[field];
        }
      }
    );

    await ticket.save();

    const populated = await populateTicket(ticket._id).lean();
    populated.resolution ||= "";

    try {
      const owner = populated.createdBy
        ? await User.findById(populated.createdBy._id).lean()
        : null;

      if (updates.assignedTo) {
        const assignee = await User.findById(updates.assignedTo).lean();
        if (assignee) {
          await sendTicketAssigned?.(populated, assignee, owner);
        }
      }

      if (updates.status === "Resolved") {
        await sendTicketResolved?.(populated, owner, req.user);
      } else {
        await sendTicketUpdated?.(populated, owner, "Ticket updated");
      }
    } catch {}

    return res.json(populated);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* DELETE TICKET */
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const deleted = await Ticket.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json({ message: "Ticket deleted" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* BASIC STATUS STATS */
export const getTicketStats = async (req, res) => {
  try {
    const stats = {};
    for (const status of TICKET_STATUSES) {
      stats[status] = await Ticket.countDocuments({ status });
    }
    stats.total = await Ticket.countDocuments();
    return res.json(stats);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ADVANCED STATS */
export const getAdvancedStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: "$department" },
      { $project: { department: "$department.name", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    return res.json(stats);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
