import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send the refreshToken httpOnly cookie
});

let accessToken = null;
export function setAccessToken(token) {
  accessToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let queue = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject })).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await apiClient.post('/auth/refresh');
        setAccessToken(data.data.accessToken);
        queue.forEach((p) => p.resolve(data.data.accessToken));
        queue = [];
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        queue.forEach((p) => p.reject(refreshErr));
        queue = [];
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
