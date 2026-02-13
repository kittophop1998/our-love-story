import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://our-love-story-backend.up.railway.app/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Letter API
export const letterApi = {
  // Upload attachment
  uploadAttachment: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/letters/upload-attachment`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.url;
  },

  // Create letter
  createLetter: async (data: {
    title: string;
    message: string;
    senderName: string;
    coverImageUrl: string;
    attachments: Array<{
      fileUrl: string;
      text: string;
      type: 'image' | 'video';
      order: number;
    }>;
  }) => {
    const response = await api.post('/letters/create', data);
    return response.data.data;
  },

  // Get letter by public ID
  getLetterByPublicId: async (publicId: string) => {
    const response = await api.get(`/letters/public/${publicId}`);
    return response.data.data;
  },
};

export default api;
