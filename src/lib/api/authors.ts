import apiClient from './client';
import type { Author, ApiResponse } from './types';

export const authorsApi = {
  // Get all authors
  getAll: async (params?: { limit?: number; page?: number }) => {
    return apiClient.get('/api/authors', { params }) as Promise<ApiResponse<Author[]>>;
  },

  // Get author by ID
  getById: async (id: string) => {
    return apiClient.get(`/api/authors/${id}`) as Promise<ApiResponse<Author>>;
  },

  // Get author's articles
  getArticles: async (id: string, params?: { limit?: number; page?: number }) => {
    return apiClient.get(`/api/authors/${id}/articles`, { params });
  },

  // Create author (admin)
  create: async (data: Partial<Author>) => {
    return apiClient.post('/api/admin/authors', data) as Promise<ApiResponse<Author>>;
  },

  // Update author (admin)
  update: async (id: string, data: Partial<Author>) => {
    return apiClient.put(`/api/admin/authors/${id}`, data) as Promise<ApiResponse<Author>>;
  },

  // Delete author (admin)
  delete: async (id: string) => {
    return apiClient.delete(`/api/admin/authors/${id}`) as Promise<ApiResponse<void>>;
  },

  // Toggle author status (admin)
  toggleStatus: async (id: string) => {
    return apiClient.patch(`/api/admin/authors/${id}/toggle-status`) as Promise<ApiResponse<Author>>;
  },
};

export default authorsApi;
