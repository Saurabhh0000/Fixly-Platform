import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  // ✅ ROLE MISMATCH → REDIRECT TO DASHBOARD
  if (role && user.role !== role) {
    const redirect =
      user.role === "ADMIN"
        ? "/admin/dashboard"
        : user.role === "PROVIDER"
        ? "/provider/dashboard"
        : "/user/dashboard";

    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default PrivateRoute;
