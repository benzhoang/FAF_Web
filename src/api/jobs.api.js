import axiosClient from "./axiosClient";


export const jobsApi = {
  // cate
  getCate : () => {
    return axiosClient.get("/categories");
  },


  // skill
  getSkills : () =>{
    return axiosClient.get("/skills");
  },

  postJobs : (data) =>{
    console.log(data)
    return axiosClient.post("/jobs", data)
  },

  getAllJobs : () =>{
    return axiosClient.get("/jobs");
  }
};