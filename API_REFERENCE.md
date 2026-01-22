# API Endpoints Reference

## Students

### POST /api/students/login
Login or create a student
```json
Request:
{
  "name": "Budi",
  "className": "5A"
}

Response (200/201):
{
  "id": 1,
  "name": "Budi",
  "className": "5A",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/students
Get all students

### GET /api/students/:id/history
Get student's quiz history

### POST /api/students/:studentId/progress
Record meeting completion (unlocks next meeting)
```json
Request:
{
  "meetingId": 1,
  "score": 80,
  "stars": 3
}

Response (201):
{
  "message": "Progress recorded successfully"
}
```

---

## Modules

### GET /api/modules
Get all modules

### GET /api/modules/:id
Get single module details

### GET /api/modules/:id/meetings?studentId=1
Get all meetings for a module (with locked status)
```json
Response:
[
  {
    "id": 1,
    "moduleId": 1,
    "title": "Pertemuan 1",
    "order": 1,
    "content": { /* MeetingContent JSONB */ },
    "locked": false,  // First meeting always unlocked
    "createdAt": "..."
  },
  {
    "id": 2,
    "moduleId": 1,
    "title": "Pertemuan 2",
    "order": 2,
    "content": { /* MeetingContent JSONB */ },
    "locked": true,   // Locked until Pertemuan 1 completed
    "createdAt": "..."
  }
]
```

---

## Meetings

### GET /api/meetings/:id
Get single meeting details
```json
Response:
{
  "id": 1,
  "moduleId": 1,
  "title": "Pertemuan 1: Pengenalan",
  "order": 1,
  "content": {
    "openingText": "Selamat datang!",
    "videos": [
      {
        "url": "https://youtube.com/watch?v=...",
        "title": "Video Pembelajaran",
        "interactions": [
          {
            "timestamp": "01:30",
            "action": "mute",
            "activityId": null
          },
          {
            "timestamp": "02:15",
            "action": "pause",
            "activityId": "activity-1"
          }
        ]
      }
    ],
    "activities": [
      {
        "id": "activity-1",
        "instruction": "Pilih jawaban yang benar!",
        "options": [
          { "color": "red", "text": "Apel" },
          { "color": "blue", "text": "Pisang" },
          { "color": "green", "text": "Jeruk" },
          { "color": "yellow", "text": "Mangga" }
        ],
        "correctIndex": 2,
        "imageUrl": "https://..."
      }
    ],
    "quiz": [
      {
        "question": "Berapa 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": "4",
        "imageUrl": null
      }
    ],
    "closingText": "Hebat! Kamu berhasil!"
  },
  "createdAt": "..."
}
```

---

## Quiz Results

### POST /api/quiz-results
Submit quiz results
```json
Request:
{
  "studentId": 1,
  "moduleId": 1,
  "meetingId": 1,
  "score": 80,
  "stars": 3
}

Response (201):
{
  "id": 1,
  "studentId": 1,
  "moduleId": 1,
  "meetingId": 1,
  "score": 80,
  "stars": 3,
  "completedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Locking Logic Explained

**How Meetings Get Unlocked:**

1. When a module has 3 meetings (Pertemuan 1, 2, 3)
2. By default:
   - Pertemuan 1: ✅ Unlocked (always accessible)
   - Pertemuan 2: 🔒 Locked
   - Pertemuan 3: 🔒 Locked

3. Student completes Pertemuan 1 (calls `/api/students/:id/progress`)
   - System marks `student_progress.meetingId = 1` as `isCompleted = 1`

4. Next API call to `/api/modules/1/meetings?studentId=1`:
   - Pertemuan 1: ✅ Unlocked (completed)
   - Pertemuan 2: ✅ **Unlocked** (previous is completed)
   - Pertemuan 3: 🔒 Locked (Pertemuan 2 not completed)

5. Student completes Pertemuan 2:
   - Pertemuan 1: ✅ Completed
   - Pertemuan 2: ✅ Completed
   - Pertemuan 3: ✅ **Unlocked** (previous is completed)

**Formula:**
```
Meeting N is unlocked IF:
  - N == 1 (first meeting) OR
  - Meeting (N-1) is completed by this student
```

---

## Testing with cURL

### Get meetings (unauthenticated)
```bash
curl http://localhost:5000/api/modules/1/meetings
```

### Get meetings for a student
```bash
curl "http://localhost:5000/api/modules/1/meetings?studentId=1"
```

### Record progress
```bash
curl -X POST http://localhost:5000/api/students/1/progress \
  -H "Content-Type: application/json" \
  -d '{"meetingId": 1, "score": 80, "stars": 3}'
```

### Get meeting details
```bash
curl http://localhost:5000/api/meetings/1
```
