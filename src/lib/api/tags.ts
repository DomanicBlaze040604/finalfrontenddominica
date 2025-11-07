import apiClient from './client';
import type { ApiResponse } from './types';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagData {
  name: string;
  slug?: string;
  description?: string;
  color: string;
}

export const tagsApi = {
  // Get all tags
  getAll: async () => {
    return apiClient.get('/api/tags') as Promise<ApiResponse<Tag[]>>;
  },

  // Get single tag by ID
  getById: async (id: string) => {
    return apiClient.get(`/api/tags/${id}`) as Promise<ApiResponse<Tag>>;
  },

  // Create new tag (admin)
  create: async (data: CreateTagData) => {
    return apiClient.post('/api/admin/tags', data) as Promise<ApiResponse<Tag>>;
  },

  // Update tag (admin)
  update: async (id: string, data: Partial<CreateTagData>) => {
    return apiClient.put(`/api/admin/tags/${id}`, data) as Promise<ApiResponse<Tag>>;
  },

  // Delete tag (admin)
  delete: async (id: string) => {
    return apiClient.delete(`/api/admin/tags/${id}`) as Promise<ApiResponse<void>>;
  },
};

export default tagsApi;
