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

  // Create new category (admin)
  create: async (data: Partial<Category>) => {
    return apiClient.post('/api/admin/categories', data) as Promise<ApiResponse<Category>>;
  },

  // Update category (admin)
  update: async (id: string, data: Partial<Category>) => {
    return apiClient.put(`/api/admin/categories/${id}`, data) as Promise<ApiResponse<Category>>;
  },

  // Delete category (admin)
  delete: async (id: string) => {
    return apiClient.delete(`/api/admin/categories/${id}`) as Promise<ApiResponse<void>>;
  },
};

export default categoriesApi;
