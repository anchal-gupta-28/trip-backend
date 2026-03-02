const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ================= CREATE TASK =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { city, title } = req.body;

    const newTask = new Task({
      user: req.user.userId,
      city,
      title
    });

    await newTask.save();

    res.status(201).json(newTask);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET USER TASKS =================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= TOGGLE TASK =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json(task);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= DELETE TASK =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;