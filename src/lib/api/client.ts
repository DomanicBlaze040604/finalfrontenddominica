import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-af44.up.railway.app';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create a typed API client that returns the response data directly
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable credentials for cookie-based auth
});

// Create a wrapper that properly types the response
export const apiClient = {
  get: <T = unknown>(url: string, config?: unknown): Promise<T> => 
    axiosInstance.get(url, config).then(response => response.data),
  
  post: <T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T> => 
    axiosInstance.post(url, data, config).then(response => response.data),
  
  put: <T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T> => 
    axiosInstance.put(url, data, config).then(response => response.data),
  
  delete: <T = unknown>(url: string, config?: unknown): Promise<T> => 
    axiosInstance.delete(url, config).then(response => response.data),
  
  patch: <T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T> => 
    axiosInstance.patch(url, data, config).then(response => response.data),
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Log CORS errors specifically
    if (error.message === 'Network Error' || !error.response) {
      console.error('🚫 CORS or Network Error - Check backend CORS configuration');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { axiosInstance };
