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
      console.log(res)
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("accessToken", token);
    await fetchMe();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchMe();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
