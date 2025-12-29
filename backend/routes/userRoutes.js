// src/routes/users.routes.js
import express from "express";
import {
  getAllUsers,
  updateUserRole,
  sendPasswordResetOTP,
  resetPasswordWithOTP,
  changePassword,
  updateProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

// Admin routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.put("/:id/role", authMiddleware, adminMiddleware, updateUserRole);

// Auth / OTP routes
router.post("/forgot-password-otp", sendPasswordResetOTP);
router.post("/reset-password-otp", resetPasswordWithOTP);

// User personal routes
router.put("/change-password", authMiddleware, changePassword);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;


