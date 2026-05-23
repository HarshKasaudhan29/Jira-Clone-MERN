import axiosInstance from "../api/axiosInstance";

/**
 * taskService
 * Wraps every /tasks endpoint.
 */
const taskService = {
  /** GET /tasks?projectId=xxx — all tasks for a project */
  getByProject: (projectId) =>
    axiosInstance.get("/tasks", { params: { projectId } }),

  /** GET /tasks/:id */
  getById: (id) => axiosInstance.get(`/tasks/${id}`),

  /** POST /tasks — create a new task inside a project */
  create: (payload) => axiosInstance.post("/tasks", payload),

  /** PUT /tasks/:id — update any task field (title, description, priority…) */
  update: (id, payload) => axiosInstance.put(`/tasks/${id}`, payload),

  /**
   * PATCH /tasks/:id/status — lightweight status-only update
   * Used by drag-and-drop so we don't send the full body.
   * @param {string} id
   * @param {"To Do" | "In Progress" | "Done"} status
   */
  updateStatus: (id, status) =>
    axiosInstance.patch(`/tasks/${id}/status`, { status }),

  /** DELETE /tasks/:id */
  remove: (id) => axiosInstance.delete(`/tasks/${id}`),
};

export default taskService;
