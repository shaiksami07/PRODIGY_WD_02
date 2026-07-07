export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer',
};
