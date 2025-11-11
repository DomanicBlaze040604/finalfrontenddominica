import apiClient from './client';
import type { ApiResponse } from './types';

export interface LiveUpdateItem {
  timestamp: Date;
  content: string;
  author: {
    id: string;
    name: string;
  };
  attachments?: string[];
}

export interface LiveUpdateMetadata {
  score?: string;
  location?: string;
  temperature?: string;
  participants?: string[];
}

export interface LiveUpdate {
  id: string;
  title: string;
  content: string;
  type: 'breaking' | 'sports' | 'weather' | 'traffic' | 'election' | 'general';
  status: 'active' | 'paused' | 'ended';
  priority: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  author: {
    id: string;
    name: string;
  };
  updates: LiveUpdateItem[];
  metadata?: LiveUpdateMetadata;
  startedAt: string;
  endedAt?: string;
  autoRefresh: boolean;
  refreshInterval: number;
  isSticky: boolean;
  showOnHomepage: boolean;
  viewCount: number;
  updateCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLiveUpdateData {
  title: string;
  content: string;
  type: 'breaking' | 'sports' | 'weather' | 'traffic' | 'election' | 'general';
  priority?: number;
  authorId: string;
  categoryId?: string;
  tags?: string[];
  metadata?: LiveUpdateMetadata;
  autoRefresh?: boolean;
  refreshInterval?: number;
  isSticky?: boolean;
  showOnHomepage?: boolean;
}

export interface AddUpdateData {
  content: string;
  authorId: string;
  attachments?: string[];
}

export interface LiveUpdatesParams {
  status?: 'active' | 'paused' | 'ended';
  type?: string;
  page?: number;
  limit?: number;
}

export const liveUpdatesApi = {
  // Public endpoints
  getAll: async (params?: LiveUpdatesParams) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiClient.get(`/api/live-updates${query ? `?${query}` : ''}`) as Promise<ApiResponse<LiveUpdate[]>>;
  },

  getActive: async (limit = 5) => {
    return apiClient.get(`/api/live-updates/active?limit=${limit}`) as Promise<ApiResponse<LiveUpdate[]>>;
  },

  getByType: async (type: string, limit = 10) => {
    return apiClient.get(`/api/live-updates/type/${type}?limit=${limit}`) as Promise<ApiResponse<LiveUpdate[]>>;
  },

  getById: async (id: string) => {
    return apiClient.get(`/api/live-updates/${id}`) as Promise<ApiResponse<LiveUpdate>>;
  },

  // Admin endpoints
  create: async (data: CreateLiveUpdateData) => {
    return apiClient.post('/api/admin/live-updates', data) as Promise<ApiResponse<LiveUpdate>>;
  },

  addUpdate: async (id: string, data: AddUpdateData) => {
    return apiClient.post(`/api/admin/live-updates/${id}/updates`, data) as Promise<ApiResponse<LiveUpdate>>;
  },

  update: async (id: string, data: Partial<LiveUpdate>) => {
    return apiClient.put(`/api/admin/live-updates/${id}`, data) as Promise<ApiResponse<LiveUpdate>>;
  },

  delete: async (id: string) => {
    return apiClient.delete(`/api/admin/live-updates/${id}`) as Promise<ApiResponse<void>>;
  },

  endLive: async (id: string) => {
    return apiClient.put(`/api/admin/live-updates/${id}`, { status: 'ended' }) as Promise<ApiResponse<LiveUpdate>>;
  },

  pauseLive: async (id: string) => {
    return apiClient.put(`/api/admin/live-updates/${id}`, { status: 'paused' }) as Promise<ApiResponse<LiveUpdate>>;
  },

  resumeLive: async (id: string) => {
    return apiClient.put(`/api/admin/live-updates/${id}`, { status: 'active' }) as Promise<ApiResponse<LiveUpdate>>;
  },
};

export default liveUpdatesApi;
