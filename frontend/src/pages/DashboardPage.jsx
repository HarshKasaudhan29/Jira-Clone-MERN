import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderKanban, Users, Calendar } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import projectService from "../services/projectService";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [projects, setProjects]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showCreateModal, setShowCreate]  = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await projectService.getAll();
        setProjects(data.projects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleProjectCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          projects={projects}
          onNewProject={() => setShowCreate(true)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Good day, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Here are all your project workspaces
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                         text-white text-sm font-medium px-4 py-2.5 rounded-lg
                         transition-colors"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>

          {/* Projects grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-xl h-36 animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <FolderKanban size={28} className="text-gray-600" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">
                No projects yet
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                Create your first project workspace and start building with your
                team.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                           text-white text-sm font-medium px-4 py-2.5 rounded-lg
                           transition-colors"
              >
                <Plus size={15} />
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5
                             hover:border-blue-500/50 hover:bg-gray-800/60
                             transition-all duration-150 text-left group"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center
                                  justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                    <FolderKanban size={18} className="text-blue-400" />
                  </div>

                  <h3 className="text-white font-semibold text-sm mb-1 truncate">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                    {project.description || "No description"}
                  </p>

                  <div className="flex items-center gap-4 text-gray-600 text-xs">
                    <span className="flex items-center gap-1">
                      <Users size={11} />
                      {project.members?.length ?? 1} member
                      {project.members?.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day:   "numeric",
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default DashboardPage;
