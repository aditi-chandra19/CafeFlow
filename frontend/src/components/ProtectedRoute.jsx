import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/menu" replace />;
  }

  return children;
}

export default ProtectedRoute;
