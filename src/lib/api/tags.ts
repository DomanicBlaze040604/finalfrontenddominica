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

  // Create new tag
  create: async (data: CreateTagData) => {
    return apiClient.post('/api/tags', data) as Promise<ApiResponse<Tag>>;
  },

  // Update tag
  update: async (id: string, data: Partial<CreateTagData>) => {
    return apiClient.put(`/api/tags/${id}`, data) as Promise<ApiResponse<Tag>>;
  },

  // Delete tag
  delete: async (id: string) => {
    return apiClient.delete(`/api/tags/${id}`) as Promise<ApiResponse<void>>;
  },
};

export default tagsApi;
