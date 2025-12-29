// src/routes/tickets.routes.js
import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketStats,
  getAdvancedStats,
} from "../controllers/ticketController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

// User-level routes
router.post("/", authMiddleware, createTicket);
router.get("/me", authMiddleware, getMyTickets);

// Stats routes
router.get("/stats", authMiddleware, getTicketStats);
router.get("/stats/advanced", authMiddleware, adminMiddleware, getAdvancedStats);

// Admin / Staff routes
router.get("/", authMiddleware, getAllTickets);

// Single ticket routes
router.get("/:id", authMiddleware, getTicketById);
router.patch("/:id", authMiddleware, updateTicket);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTicket);

export default router;
