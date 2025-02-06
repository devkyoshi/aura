import axios from 'axios';
import { getAuthFromLocalStorage } from '@/contexts/AuthContext';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Use your environment variable
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Optional: set a timeout (in milliseconds)
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const auth_data = getAuthFromLocalStorage()

    if (auth_data) {
      config.headers.Authorization = `Bearer ${auth_data.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      // Optionally, redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
