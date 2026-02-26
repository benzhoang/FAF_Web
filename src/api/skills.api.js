
import axiosClient from './axiosClient';

export const skillsApi = {
    getAllSkills() {
        return axiosClient.get("/skills"); // Endpoint: GET /api/skills
    }
};
