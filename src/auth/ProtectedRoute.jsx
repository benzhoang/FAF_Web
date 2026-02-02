import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  console.log(roles);
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/signin" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" />;
  }

  return children;
};

export default ProtectedRoute;
