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
  getFeaturedWorkers: () => {
    return axiosClient.get('/users/featured?limit=5');
  },

  // 🌟 Tính năng Follow
  followUser: (userId) => {
    return axiosClient.post(`/users/${userId}/follow`);
  },
  checkFollowStatus: (userId) => {
    return axiosClient.get(`/users/${userId}/follow-status`);
  },

  unfollowUser: (userId) => {
    return axiosClient.delete(`/users/${userId}/follow`);
  },
  getPortfolio(userId) {
    return axiosClient.get(`/users/profile/portfolio/${userId}`);
  },
  updatePortfolio(items) {
    return axiosClient.put("/users/profile/portfolio", { items });
  }
};

