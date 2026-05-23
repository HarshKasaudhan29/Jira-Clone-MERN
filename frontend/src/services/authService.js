import axiosInstance from "../api/axiosInstance";

/**
 * authService
 * Low-level service layer. The AuthContext calls these directly,
 * but they can also be used independently in tests or utilities.
 */
const authService = {
  /**
   * POST /auth/register
   */
  register: (payload) => axiosInstance.post("/auth/register", payload),

  /**
   * POST /auth/login
   */
  login: (payload) => axiosInstance.post("/auth/login", payload),

  /**
   * GET /auth/me — fetch the current user profile (optional use)
   */
  getMe: () => axiosInstance.get("/auth/me"),
};

export default authService;
