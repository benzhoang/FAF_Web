import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "../api/user.api";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await userApi.getMe();
      setUser(res);
      return res; // Return user data
    } catch (error) {
      // If token is invalid or expired, logout user
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("accessToken", token);
    const userData = await fetchMe();
    return userData; // Return user data for role-based redirect
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // Helper to get role-based home route
  const getHomeRoute = (role) => {
    const r = role?.toLowerCase();
    switch (r) {
      case "admin":
        return "/admin/dashboard";
      case "employer":
        return "/task-owner";
      case "worker":
        return "/";
      case "manager":
        return "/manager/request";
      default:
        return "/";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchMe();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchMe, getHomeRoute }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
