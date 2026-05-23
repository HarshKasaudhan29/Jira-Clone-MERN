const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status:      {
      type:    String,
      enum:    ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    priority:    { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    projectId:   { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dueDate:     { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
