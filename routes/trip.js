const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");


// ➕ Create Trip
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { city, fromDate, toDate, tasks } = req.body;

    const trip = new Trip({
      user: req.user.id,
      city,
      fromDate,
      toDate,
      tasks
    });

    await trip.save();
    res.json(trip);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 📥 Get All Trips
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });
    res.json(trips);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 📥 Get Single Trip
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔄 Toggle Task Completion (NEW)
router.put("/:tripId/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      user: req.user.id
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const task = trip.tasks.id(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;

    await trip.save();

    res.json(trip);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✏️ Update Entire Trip
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { city, fromDate, toDate, tasks } = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { city, fromDate, toDate, tasks },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ❌ Delete Trip
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;