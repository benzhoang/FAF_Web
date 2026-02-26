import axiosClient from "./axiosClient";

export const userApi = {
  getAll() {
    return axiosClient.get("/users");
  },
  getById(id) {
    return axiosClient.get(`/users/${id}`);
  },
  getMe() {
    return axiosClient.get("/users/me");
  },
  updateProfile(data) {
    return axiosClient.put("/users/me", data);
  },
  getFeaturedWorkers(limit = 10) {
    return axiosClient.get("/users/featured", { params: { limit } });
  },
  getPortfolio(userId) {
    return axiosClient.get(`/users/profile/portfolio/${userId}`);
  },
  updatePortfolio(items) {
    return axiosClient.put("/users/profile/portfolio", { items });
  }
};

