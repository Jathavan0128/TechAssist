// routes/priorityRoutes.js
import express from "express";
import { getPriorities, createPriority, updatePriority, deletePriority } from "../controllers/priorityController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

router.get("/", authMiddleware, getPriorities);
router.post("/", authMiddleware, adminMiddleware, createPriority);
router.put("/:id", authMiddleware, adminMiddleware, updatePriority);
router.delete("/:id", authMiddleware, adminMiddleware, deletePriority);

export default router;
