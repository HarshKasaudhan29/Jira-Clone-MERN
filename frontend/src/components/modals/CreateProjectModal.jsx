import { useState } from "react";
import { X } from "lucide-react";
import projectService from "../../services/projectService";

/**
 * CreateProjectModal
 * @param {function} onClose   - close the modal
 * @param {function} onCreated - called with the newly created project
 */
const CreateProjectModal = ({ onClose, onCreated }) => {
  const [form, setForm]       = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Project title is required.");
    setError("");
    setLoading(true);
    try {
      const { data } = await projectService.create(form);
      onCreated(data.project);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-base">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30
                          rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium">
              Project Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. E-Commerce Platform"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5
                         text-white text-sm placeholder-gray-600 focus:outline-none
                         focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the project…"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5
                         text-white text-sm placeholder-gray-600 focus:outline-none
                         focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60
                         text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
