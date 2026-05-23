const router = require("express").Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);   // all project routes require auth

router.route("/")
  .get(getProjects)
  .post(createProject);

router.route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.post("/:id/members",           addMember);
router.delete("/:id/members/:userId", removeMember);

module.exports = router;
