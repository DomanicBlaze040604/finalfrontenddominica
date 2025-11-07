import apiClient from './client';
import type { Category, ApiResponse } from './types';

export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    return apiClient.get('/api/categories') as Promise<ApiResponse<Category[]>>;
  },

  // Get category by slug
  getBySlug: async (slug: string) => {
    return apiClient.get(`/api/categories/${slug}`) as Promise<ApiResponse<Category>>;
  },

  // Create new category
  create: async (data: Partial<Category>) => {
    return apiClient.post('/api/categories', data) as Promise<ApiResponse<Category>>;
  },

  // Update category
  update: async (id: string, data: Partial<Category>) => {
    return apiClient.put(`/api/categories/${id}`, data) as Promise<ApiResponse<Category>>;
  },

  // Delete category
  delete: async (id: string) => {
    return apiClient.delete(`/api/categories/${id}`) as Promise<ApiResponse<void>>;
  },
};

export default categoriesApi;
