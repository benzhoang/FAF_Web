import axiosClient from "./axiosClient";

export const matchingApi = {
  getRecommendedJobs: (filters = {}) => {
    return axiosClient.get("/matching/jobs/recommended", { params: filters });
  },
  getRecommendedWorkers: (jobId, params) => {
    return axiosClient.get(`/matching/workers/${jobId}`, { params });
  },
  getAIRecommendations: (jobId) => {
    return axiosClient.get(`/matching/ai-recommendations/${jobId}`);
  }
};
