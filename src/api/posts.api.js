import axiosClient from './axiosClient';

export const postsApi = {
    // Lấy danh sách bài viết (New Feed)
    getFeed: (page = 1, limit = 20) => {
        return axiosClient.get(`/posts?page=${page}&limit=${limit}`);
    },

    // Đăng bài viết mới
    createPost: (data) => {
        // data: { content, imageUrl } or FormData
        if (data instanceof FormData) {
            return axiosClient.post('/posts', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        return axiosClient.post('/posts', data);
    },

    // Lấy danh sách bài viết theo User
    getPostsByUser: (userId, page = 1, limit = 20) => {
        return axiosClient.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    },

    // Thích / Bỏ thích bài viết
    toggleLike: (postId) => {
        return axiosClient.post(`/posts/${postId}/like`);
    },

    // Lấy danh sách bình luận
    getComments: (postId) => {
        return axiosClient.get(`/posts/${postId}/comments`);
    },

    // Thêm bình luận
    addComment: (postId, content) => {
        return axiosClient.post(`/posts/${postId}/comments`, { content });
    },

    // Xóa bài viết (chỉ chủ sở hữu)
    deletePost: (postId) => {
        return axiosClient.delete(`/posts/${postId}`);
    },

    // Cập nhật bài viết (chỉ chủ sở hữu)
    updatePost: (postId, data) => {
        if (data instanceof FormData) {
            return axiosClient.put(`/posts/${postId}`, data);
        }
        return axiosClient.put(`/posts/${postId}`, data);
    },
};
