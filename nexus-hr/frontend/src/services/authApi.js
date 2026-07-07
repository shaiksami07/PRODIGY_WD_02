import apiClient from './apiClient';

export const authApi = {
  login: (payload) => apiClient.post('/auth/login', payload),
  register: (payload) => apiClient.post('/auth/register', payload),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
  changePassword: (payload) => apiClient.post('/auth/change-password', payload),
};
