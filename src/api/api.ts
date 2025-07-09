import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500, 
});

api.interceptors.request.use(
  (config) => {
   
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      message: 'Request failed',
      isGeneric: true,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
