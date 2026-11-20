/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure Axios global interceptor for request headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) return JSON.parse(savedUser);
      const defaultUser = {
        _id: 'guest-pro-user',
        id: 'guest-pro-user',
        name: 'Alex Vance',
        email: 'alex.vance@techlead.io',
        tier: 'Platinum Pro',
        subscriptionTier: 'pro'
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Setup Axios interceptor to catch 401s and automatically log out
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const guestUser = {
        id: 'offline-guest-123',
        _id: 'offline-guest-123',
        name: 'Alex Vance',
        email: 'alex.vance@techlead.io',
        tier: 'Platinum Pro',
        subscriptionTier: 'pro'
      };
      setUser(guestUser);
      localStorage.setItem('user', JSON.stringify(guestUser));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/auth/me`);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.warn('Auth check fell back to offline demo user:', e.message);
      const guestUser = {
        id: 'offline-guest-123',
        _id: 'offline-guest-123',
        name: 'Alex Vance',
        email: 'alex.vance@techlead.io',
        tier: 'Platinum Pro',
        subscriptionTier: 'pro'
      };
      setUser(guestUser);
      localStorage.setItem('user', JSON.stringify(guestUser));
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Invalid credentials';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Registration failed';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      login,
      register,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
