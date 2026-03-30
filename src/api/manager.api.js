import axiosClient from "./axiosClient";

const managerApi = {
  // Job Management
  getPendingJobs: () => {
    return axiosClient.get("/admin/jobs/pending");
  },
  
  getAllJobs: () => {
    return axiosClient.get("/admin/jobs/all");
  },

  getJobsManagement: (page = 1, limit = 20) => {
    return axiosClient.get("/admin/management/jobs", { params: { page, limit } });
  },
  
  approveJob: (id) => {
    return axiosClient.put(`/admin/jobs/${id}/approve`);
  },
  
  rejectJob: (id, reason) => {
    return axiosClient.put(`/admin/jobs/${id}/reject`, { reason });
  },

  // User Management
  listUsers: (page = 1, limit = 10) => {
    return axiosClient.get("/admin/users", { params: { page, limit } });
  },
  
  updateUserRole: (id, role) => {
    return axiosClient.patch(`/admin/users/${id}/role`, { role });
  },

  // Platform Metrics
  getStats: () => {
    return axiosClient.get("/admin/stats");
  },
  
  getFinancials: () => {
    return axiosClient.get("/admin/financials");
  },

  getTransactions: (page = 1, limit = 20) => {
    return axiosClient.get("/admin/transactions", { params: { page, limit } });
  },

  // Dispute Management
    listDisputes: () => {
        return axiosClient.get("/disputes");
    },
    
    getDisputeDetail: (id) => {
        return axiosClient.get(`/disputes/${id}`);
    },

    getDisputeMessages: (id) => {
        return axiosClient.get(`/disputes/${id}/messages`);
    },

    addDisputeMessage: (id, message) => {
        return axiosClient.post(`/disputes/${id}/messages`, { message });
    },

    resolveDispute: (id, resolution, resolution_summary) => {
        return axiosClient.post(`/disputes/${id}/resolve`, { resolution, resolution_summary });
    },

    // Withdrawal Management
    getWithdrawals: () => {
        return axiosClient.get("/wallets/withdraw/list");
    },

    processWithdrawal: (id, { status, admin_note, proof_image_url }) => {
        return axiosClient.patch(`/wallets/withdraw/${id}/process`, { status, admin_note, proof_image_url });
    },

    uploadFile: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post("/uploads/submission", formData);
    }
};

export default managerApi;
