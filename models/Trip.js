const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false
  }
});

// 🆕 Memory Schema
const memorySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    city: {
      type: String,
      required: true
    },
    fromDate: Date,
    toDate: Date,
    tasks: [taskSchema],

    // 🆕 Add this
    memories: [memorySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);