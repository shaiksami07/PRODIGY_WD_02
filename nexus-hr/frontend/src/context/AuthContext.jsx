import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/authApi';
import { setAccessToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    toast.success('Welcome back!');
    return data.data.user;
  };

  const logout = async () => {
    await authApi.logout();
    setAccessToken(null);
    setUser(null);
  };

  const hasRole = (...roles) => user && (user.role === 'super_admin' || roles.includes(user.role));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
