# 💕 Our Love Story - ระบบจดหมายความรักวันวาเลนไทน์

ระบบสร้างจดหมายความรักสุดพิเศษสำหรับวันวาเลนไทน์ ที่ช่วยให้คุณสร้างความทรงจำที่สวยงามและแชร์ให้คนที่คุณรักผ่าน QR Code

## ✨ คุณสมบัติ

- 📸 **อัพโหลดรูปภาพหลายรูป** - เพิ่มรูปภาพความทรงจำได้ไม่จำกัด
- 🎬 **รองรับวิดีโอ** - แนบวิดีโอพิเศษของคุณได้
- ✍️ **เขียนข้อความ** - เขียนความทรงจำและข้อความถึงคนพิเศษ
- 📱 **QR Code** - รับ QR Code เพื่อแชร์ให้คนรัก
- 🎨 **UI สวยงาม** - ใช้ Material-UI พร้อมแอนิเมชั่นน่ารัก
- 💖 **แอนิเมชั่นหัวใจ** - หัวใจลอยขึ้นอัตโนมัติบนหน้าจอ

## 🚀 การติดตั้ง

1. ติดตั้ง dependencies:
\`\`\`bash
npm install
\`\`\`

2. รัน development server:
\`\`\`bash
npm run dev
\`\`\`

3. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจค

\`\`\`
app/
├── page.tsx                  # หน้าแรก
├── create/
│   └── page.tsx             # หน้าสร้างจดหมาย
├── letter/
│   └── [publicId]/
│       └── page.tsx         # หน้าแสดงจดหมาย (Public View)
├── layout.tsx               # Root layout
├── ThemeRegistry.tsx        # MUI Theme configuration
└── globals.css             # Global styles
\`\`\`

## 🔗 API Endpoints

### 1. อัพโหลดไฟล์
\`\`\`
POST http://localhost:8000/api/v1/letters/upload-attachment
Content-Type: multipart/form-data

Body: { file: File }
\`\`\`

### 2. สร้างจดหมาย
\`\`\`
POST http://localhost:8000/api/v1/letters/create
Content-Type: application/json

Body:
{
  "title": "หัวข้อจดหมาย",
  "message": "ข้อความถึงคนรัก",
  "senderName": "ชื่อผู้ส่ง",
  "coverImageUrl": "URL ของภาพปก",
  "attachments": [
    {
      "fileUrl": "out-love-story/file.jpg",
      "text": "คำบรรยาย",
      "type": "image",
      "order": 1
    }
  ]
}
\`\`\`

### 3. ดูจดหมาย (Public)
\`\`\`
GET http://localhost:8000/api/v1/letters/public/:publicId
\`\`\`

## 🎨 การใช้งาน

### สำหรับผู้ส่ง:
1. เข้าหน้าแรก และคลิก "เริ่มสร้างจดหมายความรัก"
2. กรอกข้อมูล: หัวข้อ, ชื่อผู้ส่ง, ข้อความ
3. อัพโหลดภาพปก (ถ้าต้องการ)
4. เพิ่มรูปภาพและวิดีโอพร้อมคำบรรยาย
5. กด "สร้างจดหมายความรัก"
6. รับ QR Code และแชร์ให้คนรัก

### สำหรับผู้รับ:
1. สแกน QR Code ที่ได้รับ
2. ดูจดหมายความรักที่สวยงาม
3. เลื่อนดูรูปภาพและข้อความต่างๆ
4. เพลิดเพลินกับแอนิเมชั่นหัวใจลอย ๆ

## 🛠️ เทคโนโลยีที่ใช้

- **Next.js 15** - React Framework
- **Material-UI (MUI)** - UI Components
- **TypeScript** - Type Safety
- **Axios** - HTTP Client
- **react-dropzone** - File Upload
- **qrcode.react** - QR Code Generator

## 📝 หมายเหตุ

- ต้องเปิด Backend API ที่ `http://localhost:8000` ก่อนใช้งาน
- รองรับไฟล์ภาพ: PNG, JPG, JPEG, GIF
- รองรับไฟล์วิดีโอ: MP4, MOV, AVI
- สามารถอัพโหลดรูปภาพได้หลายรูปพร้อมกัน

## 💝 ขอให้มีความสุขในวันวาเลนไทน์!

Made with ❤️ for Valentine's Day 2026
