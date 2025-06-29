import axios from "axios";
import { BASE_URL } from "./apiPaths";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/login"; // hard redirect
      } else if (error.response.status === 500) {
        console.error("Server error:", error.response.data);
      }
    } else if (error.codde === "ECONNABORTED") {
      console.error("Request timeout:", error.message);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
