import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loading from "./Loading";

const RoleBasedRedirect = () => {
  const { user, loading, getHomeRoute } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/signin" replace />;

  const homeRoute = getHomeRoute(user.role);
  return <Navigate to={homeRoute} replace />;
};

export default RoleBasedRedirect;
