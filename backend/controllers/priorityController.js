// controllers/priorityController.js
import Priority from "../models/priority.model.js";

/**
 * GET /api/priorities
 */
export const getPriorities = async (req, res) => {
  try {
    const priorities = await Priority.find().sort({ name: 1 });
    return res.json(priorities);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/priorities
 */
export const createPriority = async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const exists = await Priority.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Priority already exists" });
    }

    const priority = await Priority.create({ name });
    return res.status(201).json(priority);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/priorities/:id
 */
export const updatePriority = async (req, res) => {
  try {
    const name = req.body?.name?.trim();

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const exists = await Priority.findOne({
      _id: { $ne: req.params.id },
      name,
    });

    if (exists) {
      return res.status(400).json({ message: "Priority already exists" });
    }

    const priority = await Priority.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!priority) {
      return res.status(404).json({ message: "Priority not found" });
    }

    return res.json(priority);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/priorities/:id
 */
export const deletePriority = async (req, res) => {
  try {
    const deleted = await Priority.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Priority not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};
