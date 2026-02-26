import axiosClient from "./axiosClient";

export const matchingApi = {
  getRecommendedJobs: (filters = {}) => {
    return axiosClient.get("/matching/jobs/recommended", { params: filters });
  },
  getRecommendedWorkers: (jobId, limit = 10) => {
    return axiosClient.get(`/matching/workers/${jobId}`, { params: { limit } });
  }
};
