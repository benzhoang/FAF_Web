import axiosClient from "./axiosClient";

export const chatApi = {
    /**
     * Get list of conversations for current user
     */
    getConversations: () => {
        return axiosClient.get("/chat/conversations");
    },

    /**
     * Get messages for a specific conversation
     */
    getMessages: (conversationId) => {
        return axiosClient.get(`/chat/${conversationId}/messages`);
    },

    /**
     * Start or get an existing chat with another user
     */
    startChat: (otherUserId) => {
        return axiosClient.post("/chat/start", { otherUserId });
    }
};
