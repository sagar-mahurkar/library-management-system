import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "../types/auth.types";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={user.role === "LIBRARIAN" ? "/librarian" : "/student"} replace />;
  return <Outlet />;
}
