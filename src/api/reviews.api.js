import axiosClient from "./axiosClient";

export const reviewsApi = {
  // Get all reviews for a specific user
  getUserReviews: (userId) => {
    return axiosClient.get(`/reviews/user/${userId}`);
  },

  // Get reviews for a specific contract
  getContractReviews: (contractId) => {
    return axiosClient.get(`/reviews/contract/${contractId}`);
  },

  // Create a new review
  createReview: (data) => {
    return axiosClient.post("/reviews", data);
  }
};
