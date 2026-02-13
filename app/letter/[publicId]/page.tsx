'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  IconButton,
  CircularProgress,
  Alert,
  Fab,
} from '@mui/material';
import {
  Favorite,
  ChevronLeft,
  ChevronRight,
  Home,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { letterApi } from '@/lib/api';

interface Attachment {
  id: number;
  fileUrl: string;
  signedUrl: string;
  text: string;
  type: 'image' | 'video';
  order: number;
}

interface LetterData {
  id: number;
  title: string;
  message: string;
  publicId: string;
  senderName: string;
  coverImageUrl: string;
  coverImageSignedUrl?: string; // Add signed URL for cover image
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

export default function ViewLetterPage() {
  const params = useParams();
  const router = useRouter();
  const publicId = params.publicId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [letter, setLetter] = useState<LetterData | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  // Fetch letter data
  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const letterData = await letterApi.getLetterByPublicId(publicId);
        setLetter(letterData);
      } catch (err) {
        setError(err instanceof Error ? (err.message || 'ไม่พบจดหมายนี้') : 'เกิดข้อผิดพลาดในการโหลดจดหมาย');
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchLetter();
    }
  }, [publicId]);

  // Floating hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: 105vh;
        opacity: 0.6;
        pointer-events: none;
        z-index: 1;
        transition: all 5s linear;
        font-size: 24px;
      `;
      document.body.appendChild(heart);
      
      setTimeout(() => {
        heart.style.top = '-10vh';
        heart.style.opacity = '0';
      }, 50);
      
      setTimeout(() => heart.remove(), 5000);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const nextPhoto = () => {
    if (letter && letter.attachments.length > 0) {
      setActivePhoto((prev) => (prev + 1) % letter.attachments.length);
    }
  };

  const prevPhoto = () => {
    if (letter && letter.attachments.length > 0) {
      setActivePhoto(
        (prev) => (prev - 1 + letter.attachments.length) % letter.attachments.length
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
      </Box>
    );
  }

  if (error || !letter) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'ไม่พบจดหมาย'}
          </Alert>
        </Container>
      </Box>
    );
  }

  const sortedAttachments = [...letter.attachments].sort((a, b) => a.order - b.order);
  
  console.log('Sorted attachments:', sortedAttachments);
  console.log('Active photo:', activePhoto);
  if (sortedAttachments.length > 0) {
    console.log('Current photo URL:', sortedAttachments[activePhoto]?.signedUrl);
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
        py: 6,
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        {/* Home Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
          }}
          onClick={() => router.push('/create')}
        >
          <Home />
        </Fab>

        {/* Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            animation: 'fadeIn 1s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Favorite
            sx={{
              fontSize: 56,
              color: '#e91e63',
              mb: 2,
              animation: 'bounce 2s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#c2185b"
            gutterBottom
            sx={{ fontFamily: 'serif' }}
          >
            {letter.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" fontStyle="italic">
            &quot;ความรักของเราคือสิ่งที่ดีที่สุดที่เคยเกิดขึ้น&quot;
          </Typography>
        </Box>

        {/* Cover Image */}
        {(letter.coverImageSignedUrl || letter.coverImageUrl) && (
          <Box sx={{ mb: 6 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(233, 30, 99, 0.2)',
              }}
            >
              <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
                <Image
                  src={letter.coverImageSignedUrl || letter.coverImageUrl}
                  alt="Cover"
                  fill
                  unoptimized
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Cover image load error:', letter.coverImageSignedUrl || letter.coverImageUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </Box>
            </Card>
          </Box>
        )}

        {/* Photo Gallery */}
        {sortedAttachments.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(233, 30, 99, 0.2)',
                background: 'white',
                p: 2,
                transform: 'rotate(1deg)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(0deg)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                {sortedAttachments[activePhoto].type === 'image' ? (
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: 500,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {sortedAttachments[activePhoto].signedUrl ? (
                      <Image
                        src={sortedAttachments[activePhoto].signedUrl}
                        alt={`Memory ${activePhoto + 1}`}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                        onError={(e) => {
                          console.error('Image load error:', sortedAttachments[activePhoto].signedUrl);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">ไม่พบรูปภาพ</Typography>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%', // 16:9 aspect ratio
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <video
                      controls
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    >
                      <source src={sortedAttachments[activePhoto].signedUrl} />
                    </video>
                  </Box>
                )}

                {/* Navigation Buttons */}
                {sortedAttachments.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevPhoto}
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'white',
                        },
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={nextPhoto}
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'white',
                        },
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Pagination Dots */}
              {sortedAttachments.length > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {sortedAttachments.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        width: index === activePhoto ? 24 : 8,
                        backgroundColor:
                          index === activePhoto ? '#e91e63' : '#f8bbd0',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActivePhoto(index)}
                    />
                  ))}
                </Box>
              )}
            </Card>

            {/* Photo Description */}
            {sortedAttachments[activePhoto].text && (
              <Box
                sx={{
                  mt: 3,
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  fontStyle="italic"
                  color="#c2185b"
                  sx={{ fontFamily: 'serif', lineHeight: 1.8 }}
                >
                  &quot;{sortedAttachments[activePhoto].text}&quot;
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Final Message */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            p: 6,
            borderRadius: 6,
            boxShadow: '0 12px 48px rgba(233, 30, 99, 0.4)',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Favorite
            sx={{
              position: 'absolute',
              top: -30,
              right: -30,
              fontSize: 150,
              opacity: 0.1,
            }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            fontStyle="italic"
            gutterBottom
            sx={{ fontFamily: 'serif', letterSpacing: 2 }}
          >
            ความในใจของฉัน...
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 3,
              lineHeight: 2,
              fontWeight: 300,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {letter.message}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              จาก: {letter.senderName} 💕
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 3,
            }}
          >
            <Favorite
              sx={{
                animation: 'bounce 1s ease-in-out infinite',
              }}
            />
            <Favorite
              sx={{
                animation: 'bounce 1s ease-in-out infinite 0.2s',
              }}
            />
            <Favorite
              sx={{
                animation: 'bounce 1s ease-in-out infinite 0.4s',
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6, pb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            จำนวนคนที่ดูจดหมาย: {letter.viewCount} ครั้ง
          </Typography>
          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 1 }}>
            สร้างเมื่อ: {new Date(letter.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
