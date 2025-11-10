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
  updatedAt: string;
}

export const settingsApi = {
  // Get site settings
  get: async () => {
    return apiClient.get('/api/settings') as Promise<ApiResponse<SiteSettings>>;
  },

  // Update site settings (admin)
  update: async (data: Partial<SiteSettings>) => {
    return apiClient.put('/api/admin/settings', data) as Promise<ApiResponse<SiteSettings>>;
  },

  // Update social media links (admin)
  updateSocialMedia: async (data: SocialMediaLinks) => {
    return apiClient.put('/api/admin/settings/social-media', data) as Promise<ApiResponse<SiteSettings>>;
  },
};

export default settingsApi;
