import axiosClient from "./axiosClient";

export const authApi = {
  login(data) {
    return axiosClient.post("/auth/login", data);
  },
  register(data) {
    return axiosClient.post("/auth/register", data);
  },
  verifyOTP(data) {
    return axiosClient.post("/auth/verify-otp", data);
  },
  reSendOtp(data) {
    return axiosClient.post("/auth/resend-otp", data);
  }
//   me() {
//     return axiosClient.get("/auth/me");
//   },
};
