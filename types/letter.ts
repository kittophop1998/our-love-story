// Letter Types
export interface Attachment {
  id?: number;
  fileUrl: string;
  signedUrl?: string;
  text: string;
  type: 'image' | 'video';
  order: number;
  localPreview?: string;
}

export interface Letter {
  id: number;
  title: string;
  message: string;
  publicId: string;
  editToken?: string;
  editTokenHash?: string;
  senderName: string;
  coverImageUrl: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

export interface CreateLetterRequest {
  title: string;
  message: string;
  senderName: string;
  coverImageUrl: string;
  attachments: Omit<Attachment, 'id' | 'signedUrl' | 'localPreview'>[];
}

export interface CreateLetterResponse {
  id: number;
  publicId: string;
  editToken: string;
  title: string;
  message: string;
  senderName: string;
  coverImageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
