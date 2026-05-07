import axios from 'axios';

const API_URL = 'https://mern-backend-tcx2.onrender.com/api/users';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async (page = 1, limit = 10, search = '') => {
  const response = await api.get(`/?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const exportUsers = async () => {
  const response = await api.get('/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportUsersJSON = async () => {
  const response = await api.get('/export-json');
  return response.data;
};
