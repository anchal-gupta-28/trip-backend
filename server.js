const authMiddleware = require("./middleware/authMiddleware");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/todos", require("./routes/todo"));
app.use("/api/tasks", require("./routes/tasks"));
const tripRoutes = require("./routes/trip");
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
