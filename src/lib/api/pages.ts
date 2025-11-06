import { apiClient } from './client';

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription?: string;
  isPublished: boolean;
  showInFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageData {
  title: string;
  slug?: string;
  content: string;
  metaDescription?: string;
  isPublished?: boolean;
  showInFooter?: boolean;
}

export const pagesApi = {
  // Get all pages
  getAll: async () => {
    return apiClient.get<{ success: boolean; data: StaticPage[] }>('/api/pages');
  },

  // Get published pages for footer
  getFooterPages: async () => {
    return apiClient.get<{ success: boolean; data: StaticPage[] }>('/api/pages', {
      params: { isPublished: true, showInFooter: true }
    });
  },

  // Get single page by slug
  getBySlug: async (slug: string) => {
    return apiClient.get<{ success: boolean; data: StaticPage }>(`/api/pages/${slug}`);
  },

  // Create new page
  create: async (data: CreatePageData) => {
    return apiClient.post<{ success: boolean; data: StaticPage }>('/api/pages', data);
  },

  // Update page
  update: async (id: string, data: Partial<CreatePageData>) => {
    return apiClient.put<{ success: boolean; data: StaticPage }>(`/api/pages/${id}`, data);
  },

  // Delete page
  delete: async (id: string) => {
    return apiClient.delete<{ success: boolean }>(`/api/pages/${id}`);
  },
};

export default pagesApi;