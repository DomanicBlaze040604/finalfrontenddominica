import apiClient from './client';
import type { ApiResponse } from './types';

export interface EmbedData {
  html: string;
  provider: string;
  url: string;
  fallback?: boolean;
}

export interface SupportedPlatform {
  name: string;
  domains: string[];
  requiresAuth: boolean;
  note?: string;
}

export const embedsApi = {
  /**
   * Fetch embed HTML for a given URL
   */
  fetchEmbed: async (url: string) => {
    return apiClient.post('/api/embeds/fetch', { url }) as Promise<ApiResponse<EmbedData>>;
  },

  /**
   * Get list of supported platforms
   */
  getSupportedPlatforms: async () => {
    return apiClient.get('/api/embeds/supported') as Promise<ApiResponse<{ platforms: SupportedPlatform[] }>>;
  },

  /**
   * Detect if URL is from a supported platform
   */
  isSupportedUrl: (url: string): boolean => {
    const supportedDomains = [
      'twitter.com',
      'x.com',
      'instagram.com',
      'youtube.com',
      'youtu.be',
      'facebook.com',
      'tiktok.com',
    ];

    try {
      const urlObj = new URL(url);
      return supportedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  },
};

export default embedsApi;
