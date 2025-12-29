// routes/departmentRoutes.js
import express from "express";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

router.get("/", authMiddleware, getDepartments);
router.post("/", authMiddleware, adminMiddleware, createDepartment);
router.put("/:id", authMiddleware, adminMiddleware, updateDepartment);
router.delete("/:id", authMiddleware, adminMiddleware, deleteDepartment);

export default router;
