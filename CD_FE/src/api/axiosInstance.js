import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.181:8000',
  timeout: 5000,
});

export default axiosInstance;
