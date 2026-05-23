import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus, UserPlus, X } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import KanbanBoard from "../components/board/KanbanBoard";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import projectService from "../services/projectService";
import taskService from "../services/taskService";
import { useAuth } from "../context/AuthContext";

const ProjectDetailsPage = () => {
  const { id }   = useParams();
  const { user } = useAuth();

  const [project, setProject]     = useState(null);
  const [tasks, setTasks]         = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading]     = useState(true);

  // Modals
  const [showTaskModal, setShowTaskModal]   = useState(false);
  const [defaultStatus, setDefaultStatus]   = useState("To Do");
  const [memberEmail, setMemberEmail]       = useState("");
  const [memberError, setMemberError]       = useState("");
  const [memberLoading, setMemberLoading]   = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [projRes, taskRes, allProjRes] = await Promise.all([
          projectService.getById(id),
          taskService.getByProject(id),
          projectService.getAll(),
        ]);
        setProject(projRes.data.project);
        setTasks(taskRes.data.tasks);
        setAllProjects(allProjRes.data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Task handlers ──────────────────────────────────────────────────────
  const openCreateTask = (status) => {
    setDefaultStatus(status);
    setShowTaskModal(true);
  };

  const handleTaskCreated = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleDeleteTask = useCallback(async (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await taskService.remove(taskId);
    } catch {
      // Silently ignore; re-fetch if needed
    }
  }, []);

  // ── Member handlers ────────────────────────────────────────────────────
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setMemberError("");
    setMemberLoading(true);
    try {
      const { data } = await projectService.addMember(id, memberEmail.trim());
      setProject(data.project);
      setMemberEmail("");
    } catch (err) {
      setMemberError(err.response?.data?.message || "Failed to add member.");
    } finally {
      setMemberLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const { data } = await projectService.removeMember(id, userId);
      setProject(data.project);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────
  const isAdmin = project?.createdBy === user?._id ||
                  project?.createdBy?._id === user?._id;

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-950">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500 animate-pulse text-sm">Loading project…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col h-screen bg-gray-950">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-red-400 text-sm">Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={allProjects}
          onNewProject={() => {}}
        />

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Project header */}
          <div className="px-8 py-6 border-b border-gray-800 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">{project.title}</h1>
              {project.description && (
                <p className="text-gray-500 text-sm mt-1">{project.description}</p>
              )}
            </div>
            <button
              onClick={() => openCreateTask("To Do")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                         text-white text-sm font-medium px-4 py-2 rounded-lg
                         transition-colors shrink-0"
            >
              <Plus size={15} />
              Add Task
            </button>
          </div>

          <div className="flex gap-6 p-8 overflow-x-auto">
            {/* Board */}
            <div className="flex-1 min-w-0">
              <KanbanBoard
                tasks={tasks}
                setTasks={setTasks}
                onAddTask={openCreateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>

            {/* Team panel */}
            <div className="w-64 shrink-0">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
                  <UserPlus size={14} className="text-blue-400" />
                  Team Members
                </h3>

                {/* Add member (admin only) */}
                {isAdmin && (
                  <form onSubmit={handleAddMember} className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Email address"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg
                                   px-2.5 py-1.5 text-white text-xs placeholder-gray-600
                                   focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={memberLoading}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60
                                   text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        {memberLoading ? "…" : "Add"}
                      </button>
                    </div>
                    {memberError && (
                      <p className="text-red-400 text-xs mt-1.5">{memberError}</p>
                    )}
                  </form>
                )}

                {/* Members list */}
                <div className="flex flex-col gap-2">
                  {project.members?.map((member) => {
                    const m = typeof member === "object" ? member : { _id: member };
                    const isCreator =
                      m._id === project.createdBy ||
                      m._id === project.createdBy?._id;

                    return (
                      <div
                        key={m._id}
                        className="flex items-center justify-between gap-2 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center
                                          justify-center text-white text-[10px] font-bold shrink-0">
                            {m.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-medium truncate">
                              {m.name ?? "—"}
                            </p>
                            <p className="text-gray-500 text-[10px] truncate">
                              {isCreator ? "Admin" : "Member"}
                            </p>
                          </div>
                        </div>

                        {isAdmin && !isCreator && (
                          <button
                            onClick={() => handleRemoveMember(m._id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600
                                       hover:text-red-400 transition-all"
                            title="Remove member"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showTaskModal && (
        <CreateTaskModal
          projectId={id}
          members={project.members?.filter((m) => typeof m === "object") ?? []}
          defaultStatus={defaultStatus}
          onClose={() => setShowTaskModal(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;
