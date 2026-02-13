# 🔍 แก้ไขปัญหารูปไม่แสดงในหน้าดูจดหมาย

## การเปลี่ยนแปลง

### ✅ เพิ่ม `unoptimized` prop ให้ Image component
- Next.js Image ต้องใช้ `unoptimized` สำหรับ external images
- แก้ไขทั้ง cover image และ attachment images

### ✅ เพิ่ม console.log สำหรับ debug
เปิด Browser DevTools (F12) → Console เพื่อดูข้อมูล:

1. **Letter data** - ข้อมูลจดหมายทั้งหมดที่ได้จาก API
2. **Sorted attachments** - รายการรูปที่เรียงลำดับแล้ว
3. **Current photo URL** - URL ของรูปที่กำลังแสดง
4. **Image load error** - ถ้ารูปโหลดไม่ได้

## วิธีตรวจสอบปัญหา

### 1. ตรวจสอบ API Response
```javascript
// ใน Console จะเห็น:
Letter data: {
  id: 1,
  title: "...",
  attachments: [
    {
      id: 1,
      fileUrl: "out-love-story/xxx.JPG",
      signedUrl: "http://localhost:9000/out-love-story/xxx.JPG?...",
      text: "...",
      type: "image",
      order: 1
    }
  ]
}
```

### 2. ตรวจสอบ signedUrl
- **signedUrl** ต้องเป็น URL เต็ม เช่น `http://localhost:9000/out-love-story/xxx.JPG?X-Amz-...`
- ถ้าเป็น `null` หรือ `undefined` แสดงว่า Backend ไม่ได้สร้าง signed URL
- ลองเปิด URL ใน browser ใหม่เพื่อดูว่าไฟล์เข้าถึงได้หรือไม่

### 3. ตรวจสอบ CORS
ถ้ารูปไม่แสดงและใน Console มี error แบบนี้:
```
Access to image at 'http://localhost:9000/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**วิธีแก้**: ต้องตั้งค่า CORS ใน MinIO/S3:
```bash
# MinIO
mc anonymous set-json policy.json myminio/out-love-story
```

### 4. ตรวจสอบ Next.js Image Configuration

ใน `next.config.ts` ต้องมี:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '9000',
    },
  ],
}
```

## การแก้ปัญหาทั่วไป

### ปัญหา: รูปไม่แสดงเลย
- ตรวจสอบ Console ว่ามี error อะไร
- ตรวจสอบว่า `signedUrl` ไม่เป็น null
- ลองเปิด URL โดยตรงใน browser

### ปัญหา: Cover image ไม่แสดง
- ตรวจสอบว่า `coverImageUrl` มีค่าหรือไม่
- ตรวจสอบว่าเป็น URL เต็มหรือไม่

### ปัญหา: รูป attachment ไม่แสดง
- ตรวจสอบ `sortedAttachments` array
- ตรวจสอบว่าแต่ละ item มี `signedUrl`

## ทดสอบ

1. เปิด http://localhost:3000
2. สร้างจดหมายใหม่ และอัพโหลดรูป
3. คัดลอก Public ID
4. เข้า http://localhost:3000/letter/{publicId}
5. เปิด DevTools (F12) ดู Console
6. ตรวจสอบ log ทั้งหมด

## หากยังแก้ไม่ได้

แชร์ข้อมูลเหล่านี้:
1. Console logs ทั้งหมด
2. Network tab (ดู request/response)
3. Error message ที่เห็น
4. API response ตัวอย่าง
