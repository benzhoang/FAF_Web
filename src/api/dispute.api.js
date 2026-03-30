import axiosClient from './axiosClient';

const disputeApi = {
    // Create a dispute (Worker or Employer)
    create: (contractId, checkpointId, reason) =>
        axiosClient.post('/disputes', { contractId, checkpointId, reason }),

    // Get dispute detail (participants can see their own)
    getById: (id) =>
        axiosClient.get(`/disputes/${id}`),

    // Get dispute for a specific contract
    getByContractId: (contractId) =>
        axiosClient.get('/disputes', { params: { contractId } }),

    // Send a message in the dispute chat (all 3 parties)
    sendMessage: (id, payload) => {
        if (payload instanceof FormData) {
            return axiosClient.post(`/disputes/${id}/messages`, payload);
        }
        return axiosClient.post(`/disputes/${id}/messages`, { message: payload });
    },
    
    // Employer resolves the dispute (Concede or Escalate)
    employerResolve: (id, action) =>
        axiosClient.post(`/disputes/${id}/employer-resolve`, { action }),
};

export default disputeApi;
