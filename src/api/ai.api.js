import axiosClient from './axiosClient';

export const aiApi = {
    transcribeVideo: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post('/ai/transcribe', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
