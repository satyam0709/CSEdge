import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Renders children only when the user is signed in; otherwise redirects to /login.
 * Public marketing routes (/, /home, /login) stay outside this wrapper.
 */
export default function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-gray-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!userId) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
    );
  }

  return children;
}
