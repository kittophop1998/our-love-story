'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Favorite,
    KeyboardArrowDown,
} from '@mui/icons-material';
import { useParams } from 'next/navigation';
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
    const publicId = params.publicId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [letter, setLetter] = useState<LetterData | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

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

    // Scroll progress tracking
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            setScrollProgress(progress);

            // Check which sections are visible
            const sections = document.querySelectorAll('.story-section');
            const newVisibleSections = new Set<number>();

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top < windowHeight * 0.75 && rect.bottom > 0) {
                    newVisibleSections.add(index);
                }
            });

            setVisibleSections(newVisibleSections);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [letter]);

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
        }, 800);

        return () => clearInterval(interval);
    }, []);

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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #ffeef8 0%, #ffe0f0 50%, #ffd4e8 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Progress Bar */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'rgba(255,255,255,0.3)',
                    zIndex: 1000,
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #e91e63, #f06292, #e91e63)',
                        transition: 'width 0.1s ease',
                        width: `${scrollProgress}%`,
                        boxShadow: '0 0 10px rgba(233, 30, 99, 0.5)',
                    }}
                />
            </Box>

            {/* Hero Section - Opening */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    textAlign: 'center',
                    px: 3,
                }}
                className="story-section"
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            animation: visibleSections.has(0) ? 'fadeInUp 1.5s ease-out' : 'none',
                            '@keyframes fadeInUp': {
                                from: { opacity: 0, transform: 'translateY(40px)' },
                                to: { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        <Favorite
                            sx={{
                                fontSize: 80,
                                color: '#e91e63',
                                mb: 3,
                                animation: 'heartBeat 2s ease-in-out infinite',
                                '@keyframes heartBeat': {
                                    '0%, 100%': { transform: 'scale(1)' },
                                    '10%, 30%': { transform: 'scale(1.1)' },
                                    '20%, 40%': { transform: 'scale(1)' },
                                },
                            }}
                        />
                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            color="#c2185b"
                            gutterBottom
                            sx={{
                                fontFamily: 'serif',
                                mb: 3,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                            }}
                        >
                            {letter.title}
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            fontStyle="italic"
                            sx={{ mb: 4, fontWeight: 300 }}
                        >
                            เรื่องราวความรักของเรา
                        </Typography>
                        <Box
                            sx={{
                                animation: 'bounce 2s ease-in-out infinite',
                                '@keyframes bounce': {
                                    '0%, 100%': { transform: 'translateY(0)' },
                                    '50%': { transform: 'translateY(-15px)' },
                                },
                            }}
                        >
                            <KeyboardArrowDown sx={{ fontSize: 48, color: '#e91e63', opacity: 0.7 }} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Cover Image Section */}
            {(letter.coverImageSignedUrl || letter.coverImageUrl) && (
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        px: 3,
                    }}
                    className="story-section"
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                animation: visibleSections.has(1) ? 'scaleIn 1s ease-out' : 'none',
                                '@keyframes scaleIn': {
                                    from: { opacity: 0, transform: 'scale(0.8)' },
                                    to: { opacity: 1, transform: 'scale(1)' },
                                },
                            }}
                        >
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="#c2185b"
                                fontWeight="bold"
                                sx={{ mb: 4, fontFamily: 'serif' }}
                            >
                                บทเริ่มต้น
                            </Typography>
                            <Card
                                sx={{
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(233, 30, 99, 0.3)',
                                    transform: visibleSections.has(1) ? 'rotateY(0)' : 'rotateY(10deg)',
                                    transition: 'transform 1s ease-out',
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '100%', height: { xs: 400, md: 600 } }}>
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
                    </Container>
                </Box>
            )}

            {/* Story Chapters - Each Photo as a Chapter */}
            {sortedAttachments.map((attachment, index) => (
                <Box
                    key={attachment.id}
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        px: 3,
                    }}
                    className="story-section"
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                animation: visibleSections.has(index + 2) ? 'slideInFromSide 1s ease-out' : 'none',
                                '@keyframes slideInFromSide': {
                                    from: {
                                        opacity: 0,
                                        transform: index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)',
                                    },
                                    to: { opacity: 1, transform: 'translateX(0)' },
                                },
                            }}
                        >
                            {/* Chapter Number */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography
                                    variant="h6"
                                    color="#f06292"
                                    fontWeight="300"
                                    sx={{ mb: 1 }}
                                >
                                    Chapter {index + 1}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 1,
                                        mb: 2,
                                    }}
                                >
                                    {[...Array(3)].map((_, i) => (
                                        <Favorite
                                            key={i}
                                            sx={{
                                                fontSize: 16,
                                                color: '#f8bbd0',
                                                animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`,
                                                '@keyframes pulse': {
                                                    '0%, 100%': { opacity: 0.3 },
                                                    '50%': { opacity: 1 },
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Media Content */}
                            <Card
                                sx={{
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(233, 30, 99, 0.3)',
                                    background: 'white',
                                    transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)',
                                    transition: 'transform 0.5s ease',
                                    '&:hover': {
                                        transform: 'rotate(0deg) scale(1.02)',
                                    },
                                }}
                            >
                                {attachment.type === 'image' ? (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: '100%',
                                            height: { xs: 400, md: 600 },
                                            backgroundColor: '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {attachment.signedUrl ? (
                                            <Image
                                                src={attachment.signedUrl}
                                                alt={`Memory ${index + 1}`}
                                                fill
                                                unoptimized
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    console.error('Image load error:', attachment.signedUrl);
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
                                            paddingTop: '56.25%',
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
                                            <source src={attachment.signedUrl} />
                                        </video>
                                    </Box>
                                )}
                            </Card>

                            {/* Caption */}
                            {attachment.text && (
                                <Box
                                    sx={{
                                        mt: 4,
                                        p: 4,
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: 4,
                                        border: '2px solid rgba(233, 30, 99, 0.2)',
                                        textAlign: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        fontStyle="italic"
                                        color="#c2185b"
                                        sx={{
                                            fontFamily: 'serif',
                                            lineHeight: 2,
                                            fontWeight: 300,
                                        }}
                                    >
                                        &quot;{attachment.text}&quot;
                                    </Typography>
                                </Box>
                            )}

                            {/* Decorative Elements */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2,
                                    mt: 4,
                                }}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            backgroundColor: i === Math.floor(index % 5) ? '#e91e63' : '#f8bbd0',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box>
            ))}

            {/* Final Message Section */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    px: 3,
                }}
                className="story-section"
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            animation: visibleSections.has(sortedAttachments.length + 2) ? 'fadeInUp 1.5s ease-out' : 'none',
                        }}
                    >
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #e91e63 0%, #f06292 50%, #e91e63 100%)',
                                p: { xs: 4, md: 8 },
                                borderRadius: 8,
                                boxShadow: '0 30px 80px rgba(233, 30, 99, 0.4)',
                                textAlign: 'center',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Background Hearts */}
                            {[...Array(5)].map((_, i) => (
                                <Favorite
                                    key={i}
                                    sx={{
                                        position: 'absolute',
                                        fontSize: 120,
                                        opacity: 0.05,
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                />
                            ))}

                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                fontStyle="italic"
                                gutterBottom
                                sx={{
                                    fontFamily: 'serif',
                                    letterSpacing: 2,
                                    mb: 4,
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                ความในใจของฉัน...
                            </Typography>

                            <Box
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 4,
                                    p: 4,
                                    mb: 4,
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        lineHeight: 2.5,
                                        fontWeight: 300,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {letter.message}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 4,
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 2,
                                        width: 60,
                                        background: 'rgba(255, 255, 255, 0.5)',
                                    }}
                                />
                                <Favorite sx={{ fontSize: 32 }} />
                                <Box
                                    sx={{
                                        height: 2,
                                        width: 60,
                                        background: 'rgba(255, 255, 255, 0.5)',
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{
                                    fontFamily: 'serif',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                จากใจ: {letter.senderName} 💕
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2,
                                    mt: 4,
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                {[...Array(7)].map((_, i) => (
                                    <Favorite
                                        key={i}
                                        sx={{
                                            animation: `bounce 1s ease-in-out infinite ${i * 0.1}s`,
                                            '@keyframes bounce': {
                                                '0%, 100%': { transform: 'translateY(0)' },
                                                '50%': { transform: 'translateY(-10px)' },
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 3,
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <Favorite key={i} sx={{ color: '#e91e63', fontSize: 24 }} />
                        ))}
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        จำนวนผู้ที่ได้อ่านเรื่องราวนี้: <strong>{letter.viewCount}</strong> คน
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                        สร้างด้วยความรัก เมื่อ{' '}
                        {new Date(letter.createdAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            fontStyle="italic"
                        >
                            &quot;ทุกความทรงจำคือของขวัญที่มีค่าที่สุด&quot;
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
