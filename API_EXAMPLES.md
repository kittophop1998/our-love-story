# ตัวอย่างการเรียกใช้ API

## 1. อัพโหลดไฟล์

```bash
curl -X POST http://localhost:8000/api/v1/letters/upload-attachment \
  -F "file=@/path/to/your/image.jpg"
```

Response:
```json
{
  "success": true,
  "message": "Upload successful",
  "data": {
    "url": "out-love-story/xxx.jpg"
  }
}
```

## 2. สร้างจดหมาย

```bash
curl -X POST http://localhost:8000/api/v1/letters/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ถึงคนพิเศษของฉัน",
    "message": "ขอบคุณที่อยู่ข้างๆ ฉันเสมอ รักนะ",
    "senderName": "ฉัน",
    "coverImageUrl": "out-love-story/cover.jpg",
    "attachments": [
      {
        "fileUrl": "out-love-story/photo1.jpg",
        "text": "วันที่เราไปเที่ยวทะเลด้วยกัน",
        "type": "image",
        "order": 1
      },
      {
        "fileUrl": "out-love-story/photo2.jpg",
        "text": "ความสุขของเรา",
        "type": "image",
        "order": 2
      }
    ]
  }'
```

Response:
```json
{
  "success": true,
  "message": "Create letter successful",
  "data": {
    "id": 1,
    "publicId": "3479b93c",
    "editToken": "xxx",
    "title": "ถึงคนพิเศษของฉัน",
    "message": "ขอบคุณที่อยู่ข้างๆ ฉันเสมอ รักนะ",
    "senderName": "ฉัน",
    "coverImageUrl": "out-love-story/cover.jpg"
  }
}
```

## 3. ดูจดหมาย (Public)

```bash
curl http://localhost:8000/api/v1/letters/public/3479b93c
```

Response:
```json
{
  "success": true,
  "message": "Get letter successful",
  "data": {
    "id": 1,
    "title": "ถึงคนพิเศษของฉัน",
    "message": "ขอบคุณที่อยู่ข้างๆ ฉันเสมอ รักนะ",
    "publicId": "3479b93c",
    "senderName": "ฉัน",
    "coverImageUrl": "out-love-story/cover.jpg",
    "viewCount": 0,
    "createdAt": "2026-02-13T07:28:07.000Z",
    "updatedAt": "2026-02-13T07:28:07.000Z",
    "attachments": [
      {
        "id": 1,
        "fileUrl": "out-love-story/photo1.jpg",
        "signedUrl": "http://localhost:9000/out-love-story/photo1.jpg?...",
        "text": "วันที่เราไปเที่ยวทะเลด้วยกัน",
        "type": "image",
        "order": 1
      },
      {
        "id": 2,
        "fileUrl": "out-love-story/photo2.jpg",
        "signedUrl": "http://localhost:9000/out-love-story/photo2.jpg?...",
        "text": "ความสุขของเรา",
        "type": "image",
        "order": 2
      }
    ]
  }
}
```

## URLs

- Frontend: http://localhost:3000
- Create Page: http://localhost:3000/create
- View Letter: http://localhost:3000/letter/{publicId}
- Backend API: http://localhost:8000/api/v1
