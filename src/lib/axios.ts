import axios from 'axios';
import i18n from '@/i18n';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dev.yodda.online/api';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token and language
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Accept-Language header
    config.headers['Accept-Language'] = i18n.language || 'ru';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || error.response.statusText;
      const customError = new Error(errorMessage);
      (customError as any).status = error.response.status;
      (customError as any).data = error.response.data;
      return Promise.reject(customError);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network error: No response from server'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default apiClient;
