// src/controllers/userController.js
import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates/otpTemplate.js";

/* GET ALL USERS (ADMIN) */
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.query;

    const filter = {};

    if (search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const allowedSort = ["name", "role", "createdAt"];
    const sortField = allowedSort.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortDir === "asc" ? 1 : -1;

    const pageNum = Math.max(parseInt(page), 1);
    const lim = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * lim;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -resetOtp -resetOtpExpires")
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(lim),
      User.countDocuments(filter),
    ]);

    return res.json({
      data: users,
      total,
      page: pageNum,
      pages: Math.ceil(total / lim),
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* UPDATE USER ROLE (ADMIN) */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const targetId = req.params.id;

    if (!["employee", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.user && String(req.user._id) === String(targetId) && role !== "admin") {
      return res.status(400).json({ message: "You cannot demote yourself" });
    }

    const updated = await User.findByIdAndUpdate(
      targetId,
      { role },
      { new: true }
    ).select("-password -resetOtp -resetOtpExpires");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Role updated successfully", user: updated });
  } catch {
    return res.status(500).json({ message: "Failed to update role" });
  }
};

/* SEND PASSWORD RESET OTP */
export const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If email exists, OTP has been sent" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const { subject, text, html } = otpEmailTemplate(otp);
    await sendEmail({ to: user.email, subject, text, html });

    return res.json({ message: "If email exists, OTP has been sent" });
  } catch {
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* RESET PASSWORD WITH OTP */
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    const user = await User.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch {
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

/* CHANGE PASSWORD (AUTH USER) */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated" });
  } catch {
    return res.status(500).json({ message: "Failed to change password" });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: updated,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
