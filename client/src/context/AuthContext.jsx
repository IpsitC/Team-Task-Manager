import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ttm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveSession = (payload) => {
    localStorage.setItem('ttm_token', payload.token);
    localStorage.setItem('ttm_user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('ttm_token');
    localStorage.removeItem('ttm_user');
    setUser(null);
  }, []);

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [logout]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      saveSession(data);
      toast.success('Welcome back');
      return data.user;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      saveSession(data);
      toast.success('Account created');
      return data.user;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Signup failed'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('ttm_token')) return;

    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('ttm_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch {
      logout();
    }
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), loading, login, register, logout, refreshUser }),
    [user, loading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
