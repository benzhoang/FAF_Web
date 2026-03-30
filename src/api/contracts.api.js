import axiosClient from "./axiosClient";

export const contractsApi = {
  // Get contract by ID
  getContractById: (id) => {
    return axiosClient.get(`/contracts/${id}`);
  },

  // Get worker's active contract with checkpoints
  getMyActiveContract: () => {
    return axiosClient.get("/contracts/active/me");
  },

  // Get contract by job ID
  getContractByJob: (jobId) => {
    return axiosClient.get(`/contracts/job/${jobId}`);
  },

  // Update contract content
  updateContractContent: (id, content) => {
    return axiosClient.put(`/contracts/${id}/content`, { content });
  },

  // Sign contract
  signContract: (id, otp) => {
    return axiosClient.post(`/contracts/${id}/sign`, { otp });
  },

  // Request OTP for signing
  requestSignOtp: (id) => {
    return axiosClient.post(`/contracts/${id}/request-otp`);
  },

  // Submit checkpoint work
  submitCheckpoint: (checkpointId, data) => {
    return axiosClient.put(`/contracts/checkpoints/${checkpointId}/submit`, data);
  },

  // Approve checkpoint (employer)
  approveCheckpoint: (checkpointId, reviewNotes) => {
    return axiosClient.put(`/contracts/checkpoints/${checkpointId}/approve`, {
      review_notes: reviewNotes
    });
  },

  // Reject checkpoint (employer)
  rejectCheckpoint: (checkpointId, reviewNotes, reason) => {
    return axiosClient.put(`/contracts/checkpoints/${checkpointId}/reject`, {
      review_notes: reviewNotes,
      reason
    });
  },

  // Get contract by ID (works for both employer and worker)
  getContract: (id) => {
    return axiosClient.get(`/contracts/${id}`);
  },

  // Get all contracts for current user
  getMyContracts: () => {
    return axiosClient.get('/contracts/my');
  },
  // Request Settlement (Worker)
  requestSettlement: (contractId) => {
    return axiosClient.post(`/contracts/${contractId}/settle-request`);
  },

  // Finalize Settlement (Employer)
  finalizeSettlement: (contractId) => {
    return axiosClient.post(`/contracts/${contractId}/finalize-settlement`);
  },

  // Terminate contract (Employer or Worker)
  terminateContract: (contractId) => {
    return axiosClient.put(`/contracts/${contractId}/terminate`);
  },
};
