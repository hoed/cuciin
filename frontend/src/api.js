import axios from 'axios';

// Gunakan Environment Variable VITE_API_URL jika ada, default ke localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
});

export const getSocketUrl = () => API_URL;

export default api;
