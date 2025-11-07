import apiClient from './client';
import type { ApiResponse } from './types';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  dimensions?: string;
  alt?: string;
  uploadedAt: string;
  updatedAt: string;
}

export const mediaApi = {
  // Get all media files
  getAll: async () => {
    return apiClient.get('/api/media') as Promise<ApiResponse<MediaFile[]>>;
  },

  // Get single media file
  getById: async (id: string) => {
    return apiClient.get(`/api/media/${id}`) as Promise<ApiResponse<MediaFile>>;
  },

  // Upload media file
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post('/api/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<ApiResponse<MediaFile>>;
  },

  // Update media metadata
  update: async (id: string, data: { name?: string; alt?: string }) => {
    return apiClient.put(`/api/media/${id}`, data) as Promise<ApiResponse<MediaFile>>;
  },

  // Delete media file
  delete: async (id: string) => {
    return apiClient.delete(`/api/media/${id}`) as Promise<ApiResponse<void>>;
  },
};

export default mediaApi;
