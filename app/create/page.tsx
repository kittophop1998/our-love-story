'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Favorite,
  PhotoCamera,
  Delete,
  Send,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';

interface Attachment {
  fileUrl: string;
  text: string;
  type: 'image' | 'video';
  order: number;
  localPreview?: string;
}

interface CreatedLetter {
  id: number;
  publicId: string;
  editToken: string;
  title: string;
  message: string;
  senderName: string;
  coverImageUrl: string;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function CreateLetterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [createdLetter, setCreatedLetter] = useState<CreatedLetter | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    senderName: '',
    coverImageUrl: '',
  });

  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [origin, setOrigin] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Get origin after mount (to avoid hydration error)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
      attachments.forEach((att) => {
        if (att.localPreview) {
          URL.revokeObjectURL(att.localPreview);
        }
      });
    };
  }, [coverImagePreview, attachments]);

  // Extract path from full URL (e.g., "http://localhost:9000/out-love-story/xxx.JPG" -> "out-love-story/xxx.JPG")
  const extractPathFromUrl = (url: string): string => {
    try {
      // If it's already a path (no protocol), return as is
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return url;
      }
      
      // Parse URL and extract pathname
      const urlObj = new URL(url);
      // Remove leading slash
      return urlObj.pathname.substring(1);
    } catch (e) {
      console.error('Error parsing URL:', url, e);
      return url;
    }
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<string> => {
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
    // Response structure: { success, message, data: { id, fileurl }, timestamp }
    let fileUrl: string = '';
    
    if (typeof response.data === 'string') {
      fileUrl = response.data;
    } else if (response.data.data?.fileurl) {
      // API returns { data: { fileurl: "http://..." } }
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
  };

  // Handle file drop
  const onDrop = async (acceptedFiles: File[]) => {
    setUploadingFile(true);
    setError('');

    try {
      for (const file of acceptedFiles) {
        const fileUrlFromApi = await uploadFile(file);
        const fileUrl = extractPathFromUrl(fileUrlFromApi);
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        const localPreview = URL.createObjectURL(file);

        console.log('File URL from API:', fileUrlFromApi);
        console.log('File path to save:', fileUrl);
        console.log('Local preview URL:', localPreview);
        console.log('File type:', type);

        setAttachments((prev) => [
          ...prev,
          {
            fileUrl,
            text: '',
            type,
            order: prev.length + 1,
            localPreview,
          },
        ]);
        
        console.log('Attachment added:', {
          fileUrl,
          type,
          order: attachments.length + 1,
          localPreview,
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError('เกิดข้อผิดพลาดในการอัพโหลดไฟล์: ' + err.message);
      } else {
        setError('เกิดข้อผิดพลาดในการอัพโหลดไฟล์');
      }
    } finally {
      setUploadingFile(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
  });

  // Upload cover image
  const handleCoverImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setUploadingFile(true);
    setError('');

    try {
      const file = event.target.files[0];
      const fileUrlFromApi = await uploadFile(file);
      // Extract path from URL (supports both full URL and path)
      const fileUrl = extractPathFromUrl(fileUrlFromApi);
      const localPreview = URL.createObjectURL(file);
      
      console.log('Cover URL from API:', fileUrlFromApi);
      console.log('Cover path to save:', fileUrl);
      console.log('Cover preview URL:', localPreview);
      
      setFormData((prev) => ({ ...prev, coverImageUrl: fileUrl }));
      setCoverImagePreview(localPreview);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError('เกิดข้อผิดพลาดในการอัพโหลดภาพปก: ' + err.message);
      } else {
        setError('เกิดข้อผิดพลาดในการอัพโหลดภาพปก');
      }
    } finally {
      setUploadingFile(false);
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = prev.filter((_, i) => i !== index);
      // Reorder
      return newAttachments.map((att, idx) => ({ ...att, order: idx + 1 }));
    });
  };

  // Update attachment text
  const updateAttachmentText = (index: number, text: string) => {
    setAttachments((prev) =>
      prev.map((att, i) => (i === index ? { ...att, text } : att))
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate
      if (!formData.title || !formData.message || !formData.senderName) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      // Prepare attachments (remove localPreview)
      const attachmentsToSend = attachments.map(({ localPreview, ...att }) => {
        void localPreview; // Acknowledge unused variable
        
        // Validate fileUrl is a string
        if (typeof att.fileUrl !== 'string') {
          console.error('Invalid fileUrl type:', typeof att.fileUrl, att.fileUrl);
          throw new Error('ข้อมูลไฟล์ไม่ถูกต้อง กรุณาลองอัพโหลดใหม่');
        }
        
        return att;
      });

      const requestData = {
        ...formData,
        attachments: attachmentsToSend,
      };

      // Log request data for debugging
      console.log('Sending request to create letter:', requestData);

      const response = await axios.post(`${API_BASE_URL}/letters/create`, requestData);

      setCreatedLetter(response.data.data);
      setSuccess(true);
      setQrDialogOpen(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างจดหมาย'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดในการสร้างจดหมาย');
      }
    } finally {
      setLoading(false);
    }
  };

  // View letter
  const viewLetter = () => {
    if (createdLetter?.publicId) {
      router.push(`/letter/${createdLetter.publicId}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Favorite
            sx={{
              fontSize: 48,
              color: '#e91e63',
              mb: 2,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              },
            }}
          />
          <Typography variant="h3" fontWeight="bold" color="#c2185b" gutterBottom>
            สร้างความทรงจำของเรา
          </Typography>
          <Typography variant="body1" color="text.secondary">
            เพิ่มรูปภาพและข้อความเพื่อบอกความรักของคุณ
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            สร้างจดหมายความรักสำเร็จ! 💕
          </Alert>
        )}

        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="#e91e63" gutterBottom>
                ข้อมูลพื้นฐาน
              </Typography>
              <TextField
                fullWidth
                label="หัวข้อจดหมาย"
                variant="outlined"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="ชื่อผู้ส่ง"
                variant="outlined"
                value={formData.senderName}
                onChange={(e) =>
                  setFormData({ ...formData, senderName: e.target.value })
                }
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="ข้อความถึงคนพิเศษ"
                variant="outlined"
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </Box>

            {/* Cover Image */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="#e91e63" gutterBottom>
                ภาพปก (ถ้ามี)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                disabled={uploadingFile}
                sx={{ mb: 2 }}
              >
                อัพโหลดภาพปก
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                />
              </Button>
              {coverImagePreview && (
                <Box sx={{ position: 'relative', mt: 2 }}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: '100%',
                      height: 300,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={coverImagePreview}
                      alt="Cover"
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <IconButton
                    onClick={() => {
                      setCoverImagePreview('');
                      setFormData((prev) => ({ ...prev, coverImageUrl: '' }));
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 1)',
                      },
                    }}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* Attachments */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" color="#e91e63" gutterBottom>
                คลังรูปภาพและวิดีโอ ({attachments.length})
              </Typography>

              {/* Dropzone */}
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #f48fb1',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? '#fce4ec' : '#fff',
                  mb: 3,
                  '&:hover': {
                    backgroundColor: '#fce4ec',
                  },
                }}
              >
                <input {...getInputProps()} />
                <PhotoCamera sx={{ fontSize: 48, color: '#f48fb1', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  {isDragActive
                    ? 'วางไฟล์ที่นี่...'
                    : 'คลิกหรือลากไฟล์มาวางที่นี่'}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  รองรับไฟล์ภาพและวิดีโอ
                </Typography>
              </Box>

              {uploadingFile && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <CircularProgress size={30} />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    กำลังอัพโหลด...
                  </Typography>
                </Box>
              )}

              {/* Attachment List */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                {attachments.map((attachment, index) => (
                  <Card key={index}>
                    {attachment.type === 'image' ? (
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 200,
                          backgroundColor: '#f5f5f5',
                        }}
                      >
                        {attachment.localPreview ? (
                          <Image
                            src={attachment.localPreview}
                            alt={`Memory ${index + 1}`}
                            fill
                            unoptimized
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography color="text.secondary">
                              กำลังโหลดรูป...
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5',
                        }}
                      >
                        <Typography>วิดีโอ</Typography>
                      </Box>
                    )}
                    <CardContent>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="เขียนความทรงจำสำหรับรูปนี้..."
                        value={attachment.text}
                        onChange={(e) =>
                          updateAttachmentText(index, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          ลำดับที่ {attachment.order}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeAttachment(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || uploadingFile}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              sx={{
                py: 2,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c51162 30%, #f50057 90%)',
                },
              }}
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างจดหมายความรัก'}
            </Button>
          </form>
        </Paper>

        {/* QR Code Dialog */}
        <Dialog
          open={qrDialogOpen}
          onClose={() => setQrDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', color: '#e91e63' }}>
            <Favorite sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">
              สร้างจดหมายสำเร็จ! 💕
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              {createdLetter?.publicId && (
                <>
                  <Box
                    sx={{
                      display: 'inline-block',
                      p: 3,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      border: '2px solid #f48fb1',
                    }}
                  >
                    {origin && (
                      <QRCodeSVG
                        value={`${origin}/letter/${createdLetter.publicId}`}
                        size={200}
                        level="H"
                        includeMargin
                      />
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    สแกน QR Code เพื่อดูจดหมาย
                  </Typography>
                  {origin && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ 
                        mt: 1,
                        wordBreak: 'break-all',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(`${origin}/letter/${createdLetter.publicId}`);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }}
                      title="คลิกเพื่อคัดลอก URL"
                    >
                      {origin}/letter/{createdLetter.publicId}
                    </Typography>
                  )}
                  {copySuccess && (
                    <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                      ✓ คัดลอกแล้ว!
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    รหัสจดหมาย: {createdLetter.publicId}
                  </Typography>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={viewLetter}
              size="large"
            >
              ดูจดหมาย
            </Button>
            <Button
              variant="outlined"
              onClick={() => setQrDialogOpen(false)}
              size="large"
            >
              ปิด
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
