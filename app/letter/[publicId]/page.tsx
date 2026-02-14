'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Box,
    Typography,
    Card,
    CircularProgress,
    Alert,
    Paper,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Favorite,
    KeyboardArrowDown,
    PlayArrow,
    Pause,
    VolumeUp,
    VolumeOff,
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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

    // Music control functions
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => console.log('Audio play error:', err));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #ffeef8 0%, #ffe0f0 50%, #ffd4e8 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Audio Element */}
            <audio
                ref={audioRef}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                <source src="/music/love-song.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Floating Music Controls */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: { xs: 20, md: 30 },
                    right: { xs: 20, md: 30 },
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {/* Play/Pause Button */}
                <Tooltip title={isPlaying ? 'หยุดเพลง' : 'เล่นเพลง'} placement="left">
                    <IconButton
                        onClick={togglePlay}
                        sx={{
                            width: { xs: 50, md: 60 },
                            height: { xs: 50, md: 60 },
                            backgroundColor: 'rgba(233, 30, 99, 0.9)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 20px rgba(233, 30, 99, 0.4)',
                            '&:hover': {
                                backgroundColor: 'rgba(233, 30, 99, 1)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isPlaying ? <Pause sx={{ fontSize: { xs: 24, md: 28 } }} /> : <PlayArrow sx={{ fontSize: { xs: 24, md: 28 } }} />}
                    </IconButton>
                </Tooltip>

                {/* Mute/Unmute Button */}
                <Tooltip title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'} placement="left">
                    <IconButton
                        onClick={toggleMute}
                        sx={{
                            width: { xs: 45, md: 50 },
                            height: { xs: 45, md: 50 },
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#e91e63',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isMuted ? <VolumeOff sx={{ fontSize: { xs: 20, md: 24 } }} /> : <VolumeUp sx={{ fontSize: { xs: 20, md: 24 } }} />}
                    </IconButton>
                </Tooltip>
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
                    px: { xs: 2, md: 3 },
                    py: { xs: 4, md: 0 },
                }}
            >
                <Container maxWidth="md">
                    <Box>
                        <Favorite
                            sx={{
                                fontSize: { xs: 60, md: 80 },
                                color: '#e91e63',
                                mb: { xs: 2, md: 3 },
                            }}
                        />
                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            color="#c2185b"
                            gutterBottom
                            sx={{
                                fontFamily: 'serif',
                                mb: { xs: 2, md: 3 },
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
                            }}
                        >
                            {letter.title}
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            fontStyle="italic"
                            sx={{ 
                                mb: { xs: 3, md: 4 }, 
                                fontWeight: 300,
                                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                            }}
                        >
                            เรื่องราวความรักของเรา
                        </Typography>
                        <Box>
                            <KeyboardArrowDown sx={{ fontSize: { xs: 36, md: 48 }, color: '#e91e63', opacity: 0.7 }} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Cover Image Section */}
            {(letter.coverImageSignedUrl || letter.coverImageUrl) && (
                <Box
                    sx={{
                        minHeight: { xs: 'auto', md: '100vh' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: { xs: 6, md: 8 },
                        px: { xs: 2, md: 3 },
                    }}
                >
                    <Container maxWidth="lg">
                        <Box>
                            <Typography
                                variant="h4"
                                textAlign="center"
                                color="#c2185b"
                                fontWeight="bold"
                                sx={{ 
                                    mb: { xs: 3, md: 4 }, 
                                    fontFamily: 'serif',
                                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
                                }}
                            >
                                บทเริ่มต้น
                            </Typography>
                            <Card
                                sx={{
                                    borderRadius: { xs: 4, md: 6 },
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(233, 30, 99, 0.3)',
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '100%', height: { xs: 300, sm: 400, md: 600 } }}>
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

            {/* Polaroid Gallery Section */}
            <Box
                sx={{
                    minHeight: { xs: 'auto', md: '100vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, md: 3 },
                }}
            >
                <Container maxWidth="xl">
                    <Typography
                        variant="h3"
                        textAlign="center"
                        color="#c2185b"
                        fontWeight="bold"
                        sx={{
                            mb: { xs: 4, md: 6 },
                            fontFamily: 'var(--font-caveat), Caveat, cursive',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '4rem' },
                            px: 2,
                        }}
                    >
                        ความทรงจำในโพลารอยด์ 📸
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: { xs: 3, sm: 4 },
                            justifyItems: 'center',
                        }}
                    >
                        {sortedAttachments.map((attachment, index) => {
                            // Random rotation for polaroid effect
                            const rotations = [-3, 2, -1, 4, -2, 3, -4, 1];
                            const rotation = rotations[index % rotations.length];

                            return (
                                <Paper
                                    key={attachment.id}
                                    elevation={6}
                                    sx={{
                                        background: 'white',
                                        p: { xs: '10px 10px 20px 10px', sm: '12px 12px 25px 12px' },
                                        borderRadius: '2px',
                                        transform: `rotate(${rotation}deg)`,
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        '&:hover': {
                                            transform: 'rotate(0deg) scale(1.1) translateY(-10px)',
                                            boxShadow: '0 15px 30px rgba(255, 77, 109, 0.3)',
                                            zIndex: 50,
                                        },
                                        cursor: 'pointer',
                                        width: '100%',
                                        maxWidth: { xs: 280, sm: 320 },
                                    }}
                                >
                                    {/* Image/Video Container */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '1/1',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            mb: '10px',
                                            backgroundColor: '#f5f5f5',
                                        }}
                                    >
                                        {attachment.type === 'image' ? (
                                            attachment.signedUrl ? (
                                                <Image
                                                    src={attachment.signedUrl}
                                                    alt={attachment.text || `Memory ${index + 1}`}
                                                    fill
                                                    unoptimized
                                                    style={{ objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        console.error('Image load error:', attachment.signedUrl);
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Typography color="text.secondary">ไม่พบรูปภาพ</Typography>
                                                </Box>
                                            )
                                        ) : (
                                            <video
                                                controls
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            >
                                                <source src={attachment.signedUrl} />
                                            </video>
                                        )}
                                    </Box>

                                    {/* Caption Text */}
                                    <Typography
                                        sx={{
                                            textAlign: 'center',
                                            fontFamily: 'var(--font-caveat), Caveat, cursive',
                                            fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                            color: '#555',
                                            fontWeight: 700,
                                            wordBreak: 'break-word',
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {attachment.text || `ความทรงจำ #${index + 1}`}
                                    </Typography>
                                </Paper>
                            );
                        })}
                    </Box>
                </Container>
            </Box>

            {/* Final Message Section */}
            <Box
                sx={{
                    minHeight: { xs: 'auto', md: '100vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, md: 3 },
                }}
            >
                <Container maxWidth="md">
                    <Box>
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #e91e63 0%, #f06292 50%, #e91e63 100%)',
                                p: { xs: 3, sm: 4, md: 8 },
                                borderRadius: { xs: 6, md: 8 },
                                boxShadow: '0 30px 80px rgba(233, 30, 99, 0.4)',
                                textAlign: 'center',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Background Hearts */}
                            {[
                                { top: '10%', left: '5%', rotate: 45 },
                                { top: '25%', left: '85%', rotate: 120 },
                                { top: '60%', left: '10%', rotate: 200 },
                                { top: '75%', left: '90%', rotate: 310 },
                                { top: '40%', left: '50%', rotate: 180 },
                            ].map((position, i) => (
                                <Favorite
                                    key={i}
                                    sx={{
                                        position: 'absolute',
                                        fontSize: { xs: 80, md: 120 },
                                        opacity: 0.05,
                                        top: position.top,
                                        left: position.left,
                                        transform: `rotate(${position.rotate}deg)`,
                                        display: { xs: i > 2 ? 'none' : 'block', md: 'block' },
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
                                    letterSpacing: { xs: 1, md: 2 },
                                    mb: { xs: 3, md: 4 },
                                    position: 'relative',
                                    zIndex: 1,
                                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                                }}
                            >
                                ความในใจของฉัน...
                            </Typography>

                            <Box
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: { xs: 3, md: 4 },
                                    p: { xs: 3, md: 4 },
                                    mb: { xs: 3, md: 4 },
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        lineHeight: { xs: 2, md: 2.5 },
                                        fontWeight: 300,
                                        whiteSpace: 'pre-wrap',
                                        fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
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
                                    gap: { xs: 1, md: 2 },
                                    mb: { xs: 3, md: 4 },
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 2,
                                        width: { xs: 40, md: 60 },
                                        background: 'rgba(255, 255, 255, 0.5)',
                                    }}
                                />
                                <Favorite sx={{ fontSize: { xs: 24, md: 32 } }} />
                                <Box
                                    sx={{
                                        height: 2,
                                        width: { xs: 40, md: 60 },
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
                                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' },
                                }}
                            >
                                จากใจ: {letter.senderName} 💕
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: { xs: 1, md: 2 },
                                    mt: { xs: 3, md: 4 },
                                    position: 'relative',
                                    zIndex: 1,
                                    flexWrap: 'wrap',
                                }}
                            >
                                {[...Array(7)].map((_, i) => (
                                    <Favorite
                                        key={i}
                                        sx={{ fontSize: { xs: 20, md: 24 } }}
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
                    py: { xs: 4, md: 6 },
                    px: { xs: 2, md: 3 },
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: { xs: 1, md: 2 },
                            mb: { xs: 2, md: 3 },
                        }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <Favorite key={i} sx={{ color: '#e91e63', fontSize: { xs: 20, md: 24 } }} />
                        ))}
                    </Box>
                    <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ 
                            mb: { xs: 1.5, md: 2 },
                            fontSize: { xs: '0.95rem', md: '1rem' },
                        }}
                    >
                        จำนวนผู้ที่ได้อ่านเรื่องราวนี้: <strong>{letter.viewCount}</strong> คน
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="text.disabled"
                        sx={{ 
                            fontSize: { xs: '0.85rem', md: '0.875rem' },
                            px: { xs: 2, md: 0 },
                        }}
                    >
                        สร้างด้วยความรัก เมื่อ{' '}
                        {new Date(letter.createdAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Typography>
                    <Box sx={{ mt: { xs: 2, md: 3 } }}>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            fontStyle="italic"
                            sx={{ 
                                fontSize: { xs: '0.75rem', md: '0.8rem' },
                            }}
                        >
                            &quot;ทุกความทรงจำคือของขวัญที่มีค่าที่สุด&quot;
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
