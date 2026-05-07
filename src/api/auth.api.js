import axios from 'axios';

const API_URL = 'https://mern-backend-tcx2.onrender.com/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const login = async (email, password) => {
  const response = await api.post(`/login`, { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post(`/register`, { name, email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post(`/logout`);
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get(`/me`);
    return response.data;
  } catch (error) {
    return null;
  }
};
