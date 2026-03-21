// src/api/workSessions.api.js
import axiosClient from './axiosClient';

export const workSessionsApi = {
  getSessions: (checkpointId) =>
    axiosClient.get(`/work-sessions/${checkpointId}`),

  checkIn: (checkpointId) =>
    axiosClient.post(`/work-sessions/${checkpointId}/checkin`),

  checkOut: (checkpointId, notes = '') =>
    axiosClient.post(`/work-sessions/${checkpointId}/checkout`, { notes }),
};
