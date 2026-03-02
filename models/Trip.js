const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const tripSchema = new mongoose.Schema({
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
  tasks: [taskSchema]
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);