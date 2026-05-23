const Project = require("../models/Project");
const User    = require("../models/User");

// ── GET /api/projects ────────────────────────────────────────────────────────
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/projects/:id ────────────────────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) return res.status(404).json({ message: "Project not found." });

    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: "Access denied." });

    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/projects ───────────────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required." });

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members:   [req.user._id],   // creator is automatically a member
    });

    const populated = await project.populate("createdBy members", "name email");
    res.status(201).json({ project: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/projects/:id ────────────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can update this project." });
    }

    const { title, description } = req.body;
    if (title)       project.title       = title;
    if (description !== undefined) project.description = description;

    await project.save();
    const updated = await project.populate("createdBy members", "name email");
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/projects/:id ─────────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can delete this project." });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/projects/:id/members ───────────────────────────────────────────
const addMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can add members." });
    }

    const { email } = req.body;
    const newMember = await User.findOne({ email });
    if (!newMember) return res.status(404).json({ message: "No user found with that email." });

    const alreadyIn = project.members.some(
      (id) => id.toString() === newMember._id.toString()
    );
    if (alreadyIn) return res.status(409).json({ message: "User is already a member." });

    project.members.push(newMember._id);
    await project.save();

    const updated = await project.populate("createdBy members", "name email");
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/projects/:id/members/:userId ─────────────────────────────────
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the admin can remove members." });
    }

    if (req.params.userId === project.createdBy.toString()) {
      return res.status(400).json({ message: "Cannot remove the project admin." });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== req.params.userId
    );
    await project.save();

    const updated = await project.populate("createdBy members", "name email");
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
