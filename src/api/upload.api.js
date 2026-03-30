import axiosClient from "./axiosClient";

export const uploadApi = {
  /**
   * Upload a file for job/checkpoint submission
   * @param {File|Blob} file
   * @param {string} filename
   * @returns {Promise<{url: string, publicId: string}>}
   */
  uploadSubmission: async (file, filename = 'file') => {
    const formData = new FormData();
    formData.append('file', file, filename);

    // axiosClient automatically handles base URL and credentials
    return axiosClient.post('/uploads/submission', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * General purpose file upload (if needed)
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};
