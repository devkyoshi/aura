import axios from 'axios';
import { getAuthFromLocalStorage, saveAuthToLocalStorage } from '@/contexts/AuthContext';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const auth_data = getAuthFromLocalStorage()

    if (auth_data && auth_data.access_token) {
      config.headers.Authorization = `Bearer ${auth_data.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        withCredentials: true,
      });
    return response.data.data.access_token;
  }catch (error){
    return null;
  }
}

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (originalRequest._retryCount >= 2) {
        return Promise.reject(error);
      }
      originalRequest._retryCount++;
      try{
        const access_token = await refreshAccessToken();

        // If refresh token is successful, update the access token in local storage
        if(access_token) {
          saveAuthToLocalStorage(
            {
              access_token,
              user: getAuthFromLocalStorage()?.user as ICurrentUser
            }
          );
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Retry the original request
        return apiClient(originalRequest);
      }catch (refresh_error){
        // If refresh token fails, reject the promise
        return Promise.reject(refresh_error)
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
