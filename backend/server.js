// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing env variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Connect to MongoDB
connectDB(process.env.MONGO_URI).catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// Middleware
app.use(cors({ origin: "*", methods: "GET,POST,PUT,PATCH,DELETE", allowedHeaders: "Content-Type,Authorization" }));
app.use(express.json({ limit: "1mb" }));

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/priorities", priorityRoutes);
app.use("/api/users", userRoutes);

// Serve frontend in production
if (NODE_ENV === "production") {
  const __dirname = path.resolve();
  const frontendPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
