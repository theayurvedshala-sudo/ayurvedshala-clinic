import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const C = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        // Always ask the backend. Production can restore from the secure cookie,
        // while localStorage remains a bearer-token fallback for local/LAN use.
        const { data } = await api.get('/auth/me');
        if (active) setUser(data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('clinic_token');
          if (active) setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    function onUnauthorized() {
      localStorage.removeItem('clinic_token');
      if (active) setUser(null);
    }

    window.addEventListener('clinic:unauthorized', onUnauthorized);
    restoreSession();

    return () => {
      active = false;
      window.removeEventListener('clinic:unauthorized', onUnauthorized);
    };
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) localStorage.setItem('clinic_token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Local state still needs to be cleared even if the network request fails.
    } finally {
      localStorage.removeItem('clinic_token');
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);
