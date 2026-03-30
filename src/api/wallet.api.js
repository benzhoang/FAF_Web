import axiosClient from "./axiosClient";

export const walletApi = {
  depositZaloPay(amount) {
    return axiosClient.post("/wallets/deposit/zalopay", { amount });
  },
  depositMoMo(amount) {
    return axiosClient.post("/wallets/deposit/momo", { amount });
  },
  getMyTransactions() {
    return axiosClient.get("/wallets/transactions/my");
  },
  checkStatus(paymentId, method) {
    const endpoint = method === 'zalopay' 
      ? `/wallets/check-status/zalopay/${paymentId}`
      : `/wallets/check-status/momo/${paymentId}`;
    return axiosClient.get(endpoint);
  },
  getWallet() {
    return axiosClient.get("/users/me");
  },
  requestWithdrawal(data) {
    return axiosClient.post("/wallets/withdraw/request", data);
  }
};
