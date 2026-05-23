import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute
 * Wraps any set of routes that require authentication.
 * If the auth state is still loading (hydrating from localStorage),
 * we show nothing rather than flash a redirect.
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *     <Route path="/projects/:id" element={<ProjectDetailsPage />} />
 *   </Route>
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Avoid a redirect flash while reading from localStorage
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <span className="text-gray-400 text-sm animate-pulse">Loading…</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
