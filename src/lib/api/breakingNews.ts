import apiClient from './client';
import type { ApiResponse } from './types';

export interface BreakingNews {
  id: string;
  title: string;
  link?: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBreakingNewsData {
  title: string;
  link?: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const breakingNewsApi = {
  // Get all breaking news
  getAll: async () => {
    return apiClient.get('/api/breaking-news') as Promise<ApiResponse<BreakingNews[]>>;
  },

  // Get active breaking news
  getActive: async () => {
    return apiClient.get('/api/breaking-news/active') as Promise<ApiResponse<BreakingNews[]>>;
  },

  // Get single breaking news by ID
  getById: async (id: string) => {
    return apiClient.get(`/api/breaking-news/${id}`) as Promise<ApiResponse<BreakingNews>>;
  },

  // Create new breaking news
  create: async (data: CreateBreakingNewsData) => {
    return apiClient.post('/api/breaking-news', data) as Promise<ApiResponse<BreakingNews>>;
  },

  // Update breaking news
  update: async (id: string, data: Partial<CreateBreakingNewsData>) => {
    return apiClient.put(`/api/breaking-news/${id}`, data) as Promise<ApiResponse<BreakingNews>>;
  },

  // Delete breaking news
  delete: async (id: string) => {
    return apiClient.delete(`/api/breaking-news/${id}`) as Promise<ApiResponse<void>>;
  },

  // Toggle active status
  toggleActive: async (id: string) => {
    return apiClient.patch(`/api/breaking-news/${id}/toggle`) as Promise<ApiResponse<BreakingNews>>;
  },
};

export default breakingNewsApi;
