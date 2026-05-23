import axiosInstance from "../api/axiosInstance";

/**
 * projectService
 * Wraps every /projects endpoint. All methods return the raw Axios promise
 * so callers can handle loading/error state themselves.
 */
const projectService = {
  /** GET /projects — fetch all projects for the logged-in user */
  getAll: () => axiosInstance.get("/projects"),

  /** GET /projects/:id — single project with member details */
  getById: (id) => axiosInstance.get(`/projects/${id}`),

  /** POST /projects — create a new project workspace */
  create: (payload) => axiosInstance.post("/projects", payload),

  /** PUT /projects/:id — update project title / description */
  update: (id, payload) => axiosInstance.put(`/projects/${id}`, payload),

  /** DELETE /projects/:id — admin only */
  remove: (id) => axiosInstance.delete(`/projects/${id}`),

  /** POST /projects/:id/members — add a member by email */
  addMember: (id, email) =>
    axiosInstance.post(`/projects/${id}/members`, { email }),

  /** DELETE /projects/:id/members/:userId — remove a member */
  removeMember: (id, userId) =>
    axiosInstance.delete(`/projects/${id}/members/${userId}`),
};

export default projectService;
