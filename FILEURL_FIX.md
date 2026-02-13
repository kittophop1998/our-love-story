# 🔧 แก้ไขปัญหา fileUrl เป็น [Object]

## ปัญหาที่พบ

ตอนส่ง API create letter พบว่า:
```json
{
  "attachments": [
    { 
      "fileUrl": [Object],  // ❌ ควรเป็น string
      "text": "love", 
      "type": "image", 
      "order": 1 
    }
  ]
}
```

## สาเหตุ

API upload-attachment คืนค่ากลับมาเป็น object แต่เราไม่ได้ extract ค่า string ออกมาอย่างถูกต้อง

## วิธีแก้

### 1. เพิ่ม Debug Logs
- Log response ทั้งหมดจาก upload API
- Log fileUrl ที่ extract ได้

### 2. ปรับปรุง uploadFile Function
```typescript
// เดิม: return ค่าแบบไม่แน่นอน
return response.data.data?.url || response.data.url || response.data;

// ใหม่: ตรวจสอบทุกกรณีและ validate
let fileUrl: string = '';

if (typeof response.data === 'string') {
  fileUrl = response.data;
} else if (response.data.data?.url) {
  fileUrl = response.data.data.url;
} else if (response.data.url) {
  fileUrl = response.data.url;
} else if (response.data.data) {
  fileUrl = response.data.data;
}

// Validate ก่อน return
if (!fileUrl || typeof fileUrl !== 'string') {
  throw new Error('Invalid file URL received from server');
}

return fileUrl;
```

### 3. เพิ่ม Validation ตอน Submit
```typescript
const attachmentsToSend = attachments.map(({ localPreview, ...att }) => {
  // ตรวจสอบว่า fileUrl เป็น string
  if (typeof att.fileUrl !== 'string') {
    throw new Error('ข้อมูลไฟล์ไม่ถูกต้อง กรุณาลองอัพโหลดใหม่');
  }
  return att;
});
```

## วิธีตรวจสอบ

### 1. เปิด Browser DevTools (F12) → Console

### 2. อัพโหลดรูปภาพ จะเห็น logs:
```javascript
// Log 1: Response จาก API
Upload API response: {
  success: true,
  message: "Upload successful",
  data: {
    url: "out-love-story/xxx.JPG"
  }
}

// Log 2: fileUrl ที่ extract ได้
Extracted file URL: "out-love-story/xxx.JPG"

// Log 3: หลังอัพโหลดเสร็จ
Uploaded file URL: "out-love-story/xxx.JPG"
```

### 3. กดปุ่ม "สร้างจดหมายความรัก" จะเห็น:
```javascript
Sending request to create letter: {
  title: "test",
  message: "demo",
  senderName: "demo",
  coverImageUrl: "",
  attachments: [
    { 
      fileUrl: "out-love-story/xxx.JPG",  // ✅ เป็น string ถูกต้อง
      text: "love", 
      type: "image", 
      order: 1 
    }
  ]
}
```

## กรณีที่ยังมีปัญหา

### ถ้า fileUrl ยังเป็น [Object]:
1. ตรวจสอบ Console logs → "Upload API response"
2. ดูว่า structure ของ response เป็นอย่างไร
3. แชร์ response structure มาเพื่อแก้ไข uploadFile function

### ตัวอย่าง Response Structures:

**Structure 1:** (ปกติ)
```json
{
  "success": true,
  "data": {
    "url": "out-love-story/xxx.JPG"
  }
}
```
→ ใช้ `response.data.data.url` ✅

**Structure 2:**
```json
{
  "url": "out-love-story/xxx.JPG"
}
```
→ ใช้ `response.data.url` ✅

**Structure 3:**
```json
{
  "data": "out-love-story/xxx.JPG"
}
```
→ ใช้ `response.data.data` ✅

**Structure 4:**
```json
"out-love-story/xxx.JPG"
```
→ ใช้ `response.data` ✅

## สรุป

ตอนนี้ระบบจะ:
1. ✅ Log response ทั้งหมดจาก API
2. ✅ Extract fileUrl อย่างถูกต้อง
3. ✅ Validate ว่า fileUrl เป็น string
4. ✅ แจ้ง error ถ้าข้อมูลไม่ถูกต้อง
5. ✅ ส่ง fileUrl เป็น string ไปยัง create API

ลองอัพโหลดรูปใหม่และดู Console logs เพื่อยืนยันว่าทำงานถูกต้อง! 🎯
