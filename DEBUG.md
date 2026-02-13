# การ Debug และทดสอบ

## ตรวจสอบ Request Body

เมื่อคุณกดปุ่ม "สร้างจดหมายความรัก" ระบบจะแสดง console.log ใน Browser DevTools

### ข้อมูลที่ควรเห็น:

```javascript
Sending request to create letter: {
  title: "ชื่อจดหมาย",
  message: "ข้อความ",
  senderName: "ชื่อผู้ส่ง",
  coverImageUrl: "out-love-story/xxx.jpg",  // ถ้ามีภาพปก
  attachments: [
    {
      fileUrl: "out-love-story/xxx.JPG",  // ต้องเป็น path นี้
      text: "คำบรรยาย",
      type: "image",
      order: 1
    },
    {
      fileUrl: "out-love-story/yyy.JPG",
      text: "คำบรรยาย",
      type: "image", 
      order: 2
    }
  ]
}
```

## สิ่งที่ต้องตรวจสอบ:

1. **fileUrl** ต้องเป็น string ที่มีรูปแบบ `"out-love-story/xxx.JPG"` ไม่ใช่ full URL
2. **type** ต้องเป็น `"image"` หรือ `"video"` เท่านั้น
3. **order** ต้องเป็นตัวเลขเรียงลำดับ 1, 2, 3, ...
4. **text** สามารถเป็น string ว่างได้
5. **coverImageUrl** ถ้าไม่มีจะเป็น string ว่าง `""`

## การเปิด DevTools:

- **Chrome/Edge**: กด `F12` หรือ `Cmd+Option+I` (Mac)
- **Firefox**: กด `F12` หรือ `Cmd+Option+K` (Mac)
- ไปที่แท็บ **Console** เพื่อดู log

## ตรวจสอบ Response จาก API:

หากมีปัญหา จะมี error message แสดงใน Alert สีแดงด้านบนหน้า

Error ที่เป็นไปได้:
- "กรุณากรอกข้อมูลให้ครบถ้วน" - ต้องกรอก title, message, senderName
- "เกิดข้อผิดพลาดในการอัพโหลดไฟล์" - ตรวจสอบว่า Backend API ทำงานอยู่หรือไม่
- "เกิดข้อผิดพลาดในการสร้างจดหมาย" - ตรวจสอบ request body ว่าถูกต้องหรือไม่
