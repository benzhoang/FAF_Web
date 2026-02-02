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
  }
};
