import axiosClient from "./axiosClient";

export const proposalsApi = {
  // Submit a proposal to a job
  submitProposal: (data) => {
    return axiosClient.post("/proposals", data);
  },

  // Get worker's own proposals
  getMyProposals: () => {
    return axiosClient.get("/proposals");
  },

  // Get proposals for a specific job (employer view)
  getProposalsByJob: (jobId) => {
    return axiosClient.get("/proposals", { params: { jobId } });
  }
};
