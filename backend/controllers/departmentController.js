// controllers/departmentController.js
import Department from "../models/department.model.js";

/**
 * GET /api/departments
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return res.json({ success: true, data: departments });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/departments
 */
export const createDepartment = async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const exists = await Department.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Department already exists" });
    }

    const department = await Department.create({ name });
    return res.status(201).json({ success: true, data: department });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Department name must be unique" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PUT /api/departments/:id
 */
export const updateDepartment = async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const exists = await Department.findOne({ name });
    if (exists && exists._id.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Another department already uses this name",
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.json({ success: true, data: department });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Department name must be unique" });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * DELETE /api/departments/:id
 */
export const deleteDepartment = async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.json({ success: true, message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
