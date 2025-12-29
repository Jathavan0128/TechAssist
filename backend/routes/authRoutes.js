// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logoutUser);

export default router;
