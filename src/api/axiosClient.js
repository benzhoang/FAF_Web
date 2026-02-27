import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Request interceptor (gắn token nếu có)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If data is FormData, let the browser set Content-Type automatically
  // (it needs to include the multipart boundary string)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});


// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 - Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    }
    
    // Handle 403 - Forbidden (no permission)
    if (error.response?.status === 403) {
      window.location.href = "/forbidden";
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
