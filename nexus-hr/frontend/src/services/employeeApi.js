import apiClient from './apiClient';

export const employeeApi = {
  list: (params) => apiClient.get('/employees', { params }),
  get: (id) => apiClient.get(`/employees/${id}`),
  create: (payload) => apiClient.post('/employees', payload),
  update: (id, payload) => apiClient.put(`/employees/${id}`, payload),
  remove: (id) => apiClient.delete(`/employees/${id}`),
  restore: (id) => apiClient.patch(`/employees/${id}/restore`),
  bulkDelete: (ids) => apiClient.post('/employees/bulk-delete', { ids }),
};

export const departmentApi = {
  list: () => apiClient.get('/departments'),
  create: (payload) => apiClient.post('/departments', payload),
  update: (id, payload) => apiClient.put(`/departments/${id}`, payload),
  remove: (id) => apiClient.delete(`/departments/${id}`),
};

export const designationApi = {
  list: (params) => apiClient.get('/designations', { params }),
  create: (payload) => apiClient.post('/designations', payload),
};

export const dashboardApi = {
  summary: () => apiClient.get('/dashboard/summary'),
  departmentDistribution: () => apiClient.get('/dashboard/charts/department-distribution'),
  genderDistribution: () => apiClient.get('/dashboard/charts/gender-distribution'),
  hiringTrend: () => apiClient.get('/dashboard/charts/hiring-trend'),
  birthdays: () => apiClient.get('/dashboard/birthdays'),
};

export const leaveApi = {
  list: (params) => apiClient.get('/leaves', { params }),
  create: (payload) => apiClient.post('/leaves', payload),
  review: (id, payload) => apiClient.patch(`/leaves/${id}/review`, payload),
  cancel: (id, employee) => apiClient.patch(`/leaves/${id}/cancel`, { employee }),
};
