import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_INTERVIEW_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_INTERVIEW_API_BASE_URL is not configured');
  }

  return config;
});

export default axiosInstance;
