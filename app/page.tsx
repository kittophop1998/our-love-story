'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Favorite,
  Create,
  Visibility,
  CardGiftcard,
} from '@mui/icons-material';

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Favorite
            sx={{
              fontSize: 80,
              color: '#e91e63',
              mb: 3,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
              },
            }}
          />
          <Typography
            variant="h2"
            fontWeight="bold"
            color="#c2185b"
            gutterBottom
            sx={{ fontFamily: 'serif' }}
          >
            Happy Valentine&apos;s Day
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            fontStyle="italic"
            sx={{ mt: 2 }}
          >
            สร้างจดหมายความรักพิเศษสำหรับคนที่คุณรัก
          </Typography>
        </Box>

        {/* Features */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            mb: 6,
          }}
        >
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Create sx={{ fontSize: 60, color: '#f50057', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                สร้างจดหมาย
              </Typography>
              <Typography variant="body2" color="text.secondary">
                เพิ่มรูปภาพ วิดีโอ และข้อความหวานๆ ของคุณ
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <CardGiftcard sx={{ fontSize: 60, color: '#ff4081', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                แชร์ด้วย QR Code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                รับ QR Code สวยๆ เพื่อแชร์ให้คนพิเศษ
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-10px)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Visibility sx={{ fontSize: 60, color: '#e91e63', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                ดูจดหมาย
              </Typography>
              <Typography variant="body2" color="text.secondary">
                หน้าเว็บสวยๆ พร้อมแอนิเมชั่นโรแมนติก
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* CTA Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/create')}
            startIcon={<Favorite />}
            sx={{
              py: 2,
              px: 6,
              borderRadius: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
              boxShadow: '0 8px 24px rgba(233, 30, 99, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #c51162 30%, #f50057 90%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            เริ่มสร้างจดหมายความรัก
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3 }}
          >
            ฟรี! ไม่ต้องสมัครสมาชิก
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="body2" color="text.secondary">
            Made with <Favorite sx={{ fontSize: 14, color: '#e91e63', verticalAlign: 'middle' }} /> for Valentine&apos;s Day 2026
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
