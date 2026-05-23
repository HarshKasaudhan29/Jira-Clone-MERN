const Task    = require("../models/Task");
const Project = require("../models/Project");

// Helper: verify the user is a member of the project
const assertMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw { status: 404, message: "Project not found." };
  const isMember = project.members.some((id) => id.toString() === userId.toString());
  if (!isMember) throw { status: 403, message: "Access denied." };
  return project;
};

// ── GET /api/tasks?projectId=xxx ─────────────────────────────────────────────
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId is required." });

    await assertMember(projectId, req.user._id);

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ── GET /api/tasks/:id ───────────────────────────────────────────────────────
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: "Task not found." });
    await assertMember(task.projectId, req.user._id);
    res.json({ task });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ── POST /api/tasks ──────────────────────────────────────────────────────────
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, projectId, assignedTo, dueDate } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required." });
    }

    await assertMember(projectId, req.user._id);

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo: assignedTo || null,
      dueDate:    dueDate    || null,
    });

    const populated = await task.populate("assignedTo", "name email");
    res.status(201).json({ task: populated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ── PUT /api/tasks/:id ───────────────────────────────────────────────────────
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    await assertMember(task.projectId, req.user._id);

    const allowed = ["title", "description", "status", "priority", "assignedTo", "dueDate"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    const updated = await task.populate("assignedTo", "name email");
    res.json({ task: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ── PATCH /api/tasks/:id/status — lightweight drag-and-drop update ───────────
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["To Do", "In Progress", "Done"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    await assertMember(task.projectId, req.user._id);

    task.status = status;
    await task.save();
    const updated = await task.populate("assignedTo", "name email");
    res.json({ task: updated });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ── DELETE /api/tasks/:id ────────────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    await assertMember(task.projectId, req.user._id);
    await task.deleteOne();
    res.json({ message: "Task deleted." });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
