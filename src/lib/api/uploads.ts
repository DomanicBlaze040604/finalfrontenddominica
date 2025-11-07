import apiClient from './client';

export const uploadsApi = {
  // Upload an image (admin endpoint)
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return apiClient.post('/api/admin/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<{ success: boolean; data: { url: string } }>;
  },

  // Upload a file (legacy support)
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<{ success: boolean; url: string }>;
  },

  // Upload multiple files
  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return apiClient.post('/api/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<{ success: boolean; urls: string[] }>;
  },
};

export default uploadsApi;
