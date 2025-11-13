import apiClient from './client';
import type { ApiResponse } from './types';

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  email?: string;
}

export interface SiteSettings {
  id: string;
  socialMedia: SocialMediaLinks;
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  homepageSectionOrder?: 'featured-first' | 'latest-first';
  homepageCategories?: string[]; // Array of category IDs to show on homepage in order
  updatedAt: string;
}

export const settingsApi = {
  // Get site settings
  get: async () => {
    return apiClient.get('/api/settings') as Promise<ApiResponse<SiteSettings>>;
  },

  // Update site settings (admin)
  update: async (data: Partial<SiteSettings>): Promise<ApiResponse<SiteSettings>> => {
    console.log('📤 Sending settings update:', data);
    try {
      // Use /original endpoint which accepts full settings object
      const result = await apiClient.put<ApiResponse<SiteSettings>>('/api/admin/settings/original', data);
      console.log('✅ Settings update successful:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Settings update failed:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },

  // Update social media links (admin)
  updateSocialMedia: async (data: SocialMediaLinks) => {
    return apiClient.put('/api/admin/settings/social-media', { socialMedia: data }) as Promise<ApiResponse<SiteSettings>>;
  },
};

export default settingsApi;
