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
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    // Handle 401 - Unauthorized: only redirect if NOT an auth endpoint
    // (auth endpoints return 401 for wrong password - should show error in UI, not redirect)
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    }
    
    // Handle 403 - Forbidden (no permission)
    // Removed global redirect to /forbidden to allow custom handling in components
    
    return Promise.reject(error);
  }
);

export default axiosClient;
