import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_BASE_URL";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attaches the JWT token to every outgoing request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
// Handles global 401 responses (token expired / invalid).
// Clears storage and redirects to login without needing React Router here.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Hard redirect so AuthContext re-initialises cleanly
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
