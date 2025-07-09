import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
});

if (process.env.NODE_ENV === 'production') {
  api.interceptors.response.use(
    response => response,
    error => {
      return Promise.reject({
        message: 'Request failed',
        isGeneric: true, 
        status: error.response?.status
      });
    }
  );
  
  api.interceptors.request.use(config => {
    return config;
  });
}

export default api;