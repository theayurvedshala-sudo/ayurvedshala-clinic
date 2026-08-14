import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clinic_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do not hard-redirect from here. A single API 401 used to remove the token
    // and reload /login even when another valid auth mechanism was available.
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('clinic:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
export const errorMessage = (e) =>
  e?.response?.data?.message || e?.message || 'Something went wrong';
