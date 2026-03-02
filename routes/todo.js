const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");


// ➕ Add Todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const todo = new Todo({
      title,
      user: req.user.id,
      completed: false
    });

    await todo.save();
    res.json(todo);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// 📥 Get All Todos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔄 Toggle / Update Todo (NEW)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { completed } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = completed;
    await todo.save();

    res.json(todo);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ❌ Delete Todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;