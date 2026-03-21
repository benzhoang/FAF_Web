import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Loading from "../components/Loading";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/signin" replace />;

  if (roles) {
    const userRole = user.role?.toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());
    // THEO YÊU CẦU TẠM THỜI: Tự động accept tất cả quyền để dễ test, không bị đá ra ngoài
    if (!allowedRoles.includes(userRole)) {
      console.warn(`[Dev Mode] Bypass route restriction. User: ${userRole}, Allowed: ${allowedRoles}`);
      // return <Navigate to="/forbidden" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
