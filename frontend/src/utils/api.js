import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

let is401Shown = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Reset 401 flag on successful response
    is401Shown = false;
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      // Only show message once to avoid spamming
      if (!is401Shown) {
        is401Shown = true;
        const message = 'Your session has expired. Please log in again to continue.';
        
        // Show alert and redirect after a brief delay
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("profilePhoto");
          window.location.href = "/login?message=" + encodeURIComponent(message);
        }, 500);
      }
    } else if (error?.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
