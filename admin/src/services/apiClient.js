import axios from 'axios';
import { APP_CONSTANTS } from '../config/constants';

// API Base URL - uses env variable with a dynamic fallback to the current hostname
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:4000`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
      localStorage.removeItem(APP_CONSTANTS.IS_ADMIN_KEY);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
