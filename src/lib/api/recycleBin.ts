import apiClient from './client';
import type { ApiResponse } from './types';

export interface RecycleBinItem {
  id: string;
  type: 'article' | 'category' | 'tag' | 'page' | 'breaking-news';
  title: string;
  deletedAt: string;
  deletedBy?: string;
  expiresAt: string;
  originalData: any;
}

export const recycleBinApi = {
  // Get all items in recycle bin
  getAll: async () => {
    return apiClient.get('/api/admin/recycle-bin') as Promise<ApiResponse<RecycleBinItem[]>>;
  },

  // Get items by type
  getByType: async (type: RecycleBinItem['type']) => {
    return apiClient.get(`/api/admin/recycle-bin/${type}`) as Promise<ApiResponse<RecycleBinItem[]>>;
  },

  // Restore an item from recycle bin
  restore: async (id: string, type: RecycleBinItem['type']) => {
    return apiClient.post(`/api/admin/recycle-bin/${type}/${id}/restore`) as Promise<ApiResponse<any>>;
  },

  // Permanently delete an item
  permanentDelete: async (id: string, type: RecycleBinItem['type']) => {
    return apiClient.delete(`/api/admin/recycle-bin/${type}/${id}`) as Promise<ApiResponse<void>>;
  },

  // Empty entire recycle bin
  emptyBin: async () => {
    return apiClient.delete('/api/admin/recycle-bin/empty') as Promise<ApiResponse<void>>;
  },

  // Empty recycle bin by type
  emptyByType: async (type: RecycleBinItem['type']) => {
    return apiClient.delete(`/api/admin/recycle-bin/${type}/empty`) as Promise<ApiResponse<void>>;
  },
};

export default recycleBinApi;
