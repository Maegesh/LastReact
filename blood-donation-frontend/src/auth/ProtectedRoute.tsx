import { Navigate } from "react-router-dom";
import { tokenstore } from "./tokenstore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = tokenstore.get();
  const userRole = tokenstore.getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole !== undefined && parseInt(userRole || "0") !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}