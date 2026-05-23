import { NavLink } from "react-router-dom";
import { LayoutGrid, FolderKanban, Plus } from "lucide-react";

/**
 * Sidebar
 * Receives `projects` (array) and `onNewProject` callback from parent.
 */
const Sidebar = ({ projects = [], onNewProject }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
      isActive
        ? "bg-blue-600/20 text-blue-400 font-medium"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-4 px-3 shrink-0">
      {/* Main nav */}
      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutGrid size={15} />
          Dashboard
        </NavLink>
      </nav>

      {/* Projects section */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
            Projects
          </span>
          <button
            onClick={onNewProject}
            title="New project"
            className="p-0.5 rounded text-gray-500 hover:text-blue-400 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          {projects.length === 0 && (
            <p className="text-gray-600 text-xs px-2 py-1">No projects yet</p>
          )}
          {projects.map((project) => (
            <NavLink
              key={project._id}
              to={`/projects/${project._id}`}
              className={linkClass}
            >
              <FolderKanban size={14} />
              <span className="truncate">{project.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
