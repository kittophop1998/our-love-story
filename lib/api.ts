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
    
    // Debug: Log full response
    console.log('Upload API response:', response.data);
    
    // Extract file URL from response
    let fileUrl: string = '';
    
    if (typeof response.data === 'string') {
      fileUrl = response.data;
    } else if (response.data.data?.fileurl) {
      fileUrl = response.data.data.fileurl;
    } else if (response.data.data?.url) {
      fileUrl = response.data.data.url;
    } else if (response.data.fileurl) {
      fileUrl = response.data.fileurl;
    } else if (response.data.url) {
      fileUrl = response.data.url;
    } else if (typeof response.data.data === 'string') {
      fileUrl = response.data.data;
    }
    
    console.log('Extracted file URL:', fileUrl);
    
    if (!fileUrl || typeof fileUrl !== 'string') {
      console.error('Failed to extract fileUrl from:', response.data);
      throw new Error('Invalid file URL received from server');
    }
    
    return fileUrl;
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
