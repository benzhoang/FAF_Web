import axiosClient from "./axiosClient";

export const notificationApi = {
    getNotifications: () => {
        return axiosClient.get('/notifications');
    },
    markAsRead: (id) => {
        return axiosClient.put(`/notifications/${id}/read`);
    },
    markAllAsRead: () => {
        return axiosClient.put('/notifications/read-all');
    }
};
