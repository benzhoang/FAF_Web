import axiosClient from "./axiosClient";


export const jobsApi = {
  // cate
  getCate: () => {
    return axiosClient.get("/categories");
  },

  // skill
  getSkills: () => {
    return axiosClient.get("/skills");
  },

  postJobs: (data) => {
    return axiosClient.post("/jobs", data);
  },

  getAllJobs: (params = {}) => {
    return axiosClient.get("/jobs", { params });
  },

  getMyJobs: (clientId) => {
    return axiosClient.get("/jobs", { params: { clientId } });
  },

  getJobDetail: (id) => {
    return axiosClient.get(`/jobs/${id}`);
  },

  deleteJob: (id) => {
    return axiosClient.delete(`/jobs/${id}`);
  },

  updateJob: (id, data) => {
    return axiosClient.put(`/jobs/${id}`, data);
  },

  // Proposals
  getJobProposals: (jobId) => {
    return axiosClient.get("/proposals", { params: { jobId } });
  },

  acceptProposal: (id) => {
    return axiosClient.put(`/proposals/${id}/accept`);
  },

  rejectProposal: (id) => {
    return axiosClient.put(`/proposals/${id}/reject`);
  }
};