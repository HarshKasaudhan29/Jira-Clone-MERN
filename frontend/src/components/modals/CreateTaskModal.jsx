import { useState } from "react";
import { X } from "lucide-react";
import taskService from "../../services/taskService";

const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES   = ["To Do", "In Progress", "Done"];

/**
 * CreateTaskModal
 * @param {string}   projectId      - current project ID
 * @param {array}    members        - [{_id, name, email}]
 * @param {string}   defaultStatus  - column the + button was clicked in
 * @param {function} onClose
 * @param {function} onCreated      - called with the new task
 */
const CreateTaskModal = ({
  projectId,
  members = [],
  defaultStatus = "To Do",
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState({
    title:      "",
    description:"",
    priority:   "Medium",
    status:     defaultStatus,
    assignedTo: "",
    dueDate:    "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Task title is required.");
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, projectId };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (!payload.dueDate)    delete payload.dueDate;

      const { data } = await taskService.create(payload);
      onCreated(data.task);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm " +
    "placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-white font-semibold text-base">Create Task</h2>
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
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Add more detail…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs font-medium">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs font-medium">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee + Due Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs font-medium">Assignee</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
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
              {loading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
