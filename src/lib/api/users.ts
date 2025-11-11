import apiClient from './client';
import type { ApiResponse } from './types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'editor' | 'user';
}

export interface UpdateUserData {
  fullName?: string;
  role?: 'admin' | 'editor' | 'user';
  isActive?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  roles: {
    admin: number;
    editor: number;
    user: number;
  };
  recentSignups: number;
}

export const usersApi = {
  // Get all users (Admin only)
  getAll: async () => {
    return apiClient.get('/api/admin/users') as Promise<ApiResponse<{ users: User[]; total: number }>>;
  },

  // Get user by ID (Admin only)
  getById: async (id: string) => {
    return apiClient.get(`/api/admin/users/${id}`) as Promise<ApiResponse<{ user: User }>>;
  },

  // Get user statistics (Admin only)
  getStats: async () => {
    return apiClient.get('/api/admin/users/stats') as Promise<ApiResponse<UserStats>>;
  },

  // Create new user (Admin only)
  create: async (data: CreateUserData) => {
    return apiClient.post('/api/admin/users', data) as Promise<ApiResponse<{ user: User }>>;
  },

  // Update user (Admin only)
  update: async (id: string, data: UpdateUserData) => {
    return apiClient.put(`/api/admin/users/${id}`, data) as Promise<ApiResponse<{ user: User }>>;
  },

  // Delete user (Admin only)
  delete: async (id: string) => {
    return apiClient.delete(`/api/admin/users/${id}`) as Promise<ApiResponse<void>>;
  },

  // Toggle user status (Admin only)
  toggleStatus: async (id: string) => {
    return apiClient.patch(`/api/admin/users/${id}/toggle-status`) as Promise<ApiResponse<{ user: User }>>;
  },
};

export default usersApi;
