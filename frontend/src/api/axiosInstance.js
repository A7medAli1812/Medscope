// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://med-scope1.runasp.net/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',

  },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
// Attach the Bearer token on every outgoing request, reading it fresh each time.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────────
// • 401 → session expired/invalid → clear storage and redirect to login
// • Log all other errors in development for easier debugging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.error(
        `[Axios] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.data || error.message
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
