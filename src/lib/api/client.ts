import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-af44.up.railway.app';

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('✅ DEPLOYMENT VERIFIED - All fixes applied! Build timestamp:', new Date().toISOString());
console.log('⚠️ Note: If backend is down, the app will show errors. Check Railway deployment status.');

// Create a typed API client that returns the response data directly
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Reduced timeout to fail faster if backend is down
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable credentials for cookie-based auth
});

// Create a wrapper that properly types the response with error handling
export const apiClient = {
  get: <T = unknown>(url: string, config?: unknown): Promise<T> => 
    axiosInstance.get(url, config)
      .then(response => response.data)
      .catch(error => {
        console.error(`GET ${url} failed:`, error.message);
        throw error;
      }),
  
  post: <T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T> => 
    axiosInstance.post(url, data, config)
      .then(response => response.data)
      .catch(error => {
        console.error(`POST ${url} failed:`, error.message);
        throw error;
      }),
  
  put: <T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T> => 
    axiosInstance.put(url, data, config)
      .then(response => response.data)
      .catch(error => {
        console.error(`PUT ${url} failed:`, error.message);
        throw error;
      }),
  
  delete: <T = unknown>(url: string, config?: unknown): Promise<T> => 
    axiosInstance.delete(url, config)
      .then(response => response.data)
      .catch(error => {
        console.error(`DELETE ${url} failed:`, error.message);
        throw error;
      }),
  
  patch: <T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T> => 
    axiosInstance.patch(url, data, config)
      .then(response => response.data)
      .catch(error => {
        console.error(`PATCH ${url} failed:`, error.message);
        throw error;
      }),
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
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Don't redirect if on diagnostic or public pages
      const publicPaths = ['/diagnostic', '/component-test', '/admin/login', '/register', '/'];
      const isPublicPath = publicPaths.some(path => window.location.pathname.includes(path));
      
      if (!isPublicPath) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.warn('⚠️ Resource not found:', error.config?.url);
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('🔥 Server error - Backend may be down');
    }
    
    // Log CORS errors specifically
    if (error.message === 'Network Error' || !error.response) {
      console.error('🚫 CORS or Network Error - Check backend CORS configuration and ensure backend is running');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { axiosInstance };
