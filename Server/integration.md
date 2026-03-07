# API Integration Guide

This document maps out all the available backend endpoints, their methods, required authentication, and the expected request payloads. Use this to integrate the React frontend with the Node.js backend.

---

## Base URL
\`http://localhost:5000/api\`

---

## 1. Authentication (\`/auth\`)

### Register a new user
- **URL**: \`/auth/register\`
- **Method**: \`POST\`
- **Auth Required**: No
- **Body**:
  \`\`\`json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "patient" // optional: 'patient' (default), 'doctor', 'admin'
  }
  \`\`\`

### Login user
- **URL**: \`/auth/login\`
- **Method**: \`POST\`
- **Auth Required**: No
- **Body**:
  \`\`\`json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  \`\`\`

### Get Current User Profile
- **URL**: \`/auth/me\`
- **Method**: \`GET\`
- **Auth Required**: Yes (Bearer Token)
- **Body**: None

---

## 2. Therapists (\`/therapists\`)

### Get All Therapists
- **URL**: \`/therapists\`
- **Method**: \`GET\`
- **Auth Required**: No
- **Query Parameters** (optional):
  - \`specialization=Anxiety\`
  - \`isFreeSupport=true\`
  - \`minRating=4.5\`

### Get Single Therapist
- **URL**: \`/therapists/:id\`
- **Method**: \`GET\`
- **Auth Required**: No

### Create Therapist (Admin Only)
- **URL**: \`/therapists\`
- **Method**: \`POST\`
- **Auth Required**: Yes (Admin)
- **Body**:
  \`\`\`json
  {
    "name": "Dr. Sarah Mitchell",
    "email": "sarah@herspace.com",
    "specialization": "Anxiety & Depression",
    "experience": 12,
    "sessionPrice": 150,
    "isFreeSupport": false,
    "availability": ["Mon 9-5", "Wed 9-5"],
    "bio": "Experienced therapist..."
  }
  \`\`\`

### Update Therapist (Admin Only)
- **URL**: \`/therapists/:id\`
- **Method**: \`PATCH\`
- **Auth Required**: Yes (Admin)
- **Body**: Any field from Create Therapist model.

### Delete Therapist (Admin Only)
- **URL**: \`/therapists/:id\`
- **Method**: \`DELETE\`
- **Auth Required**: Yes (Admin)

---

## 3. Appointments (\`/appointments\`)

### Book an Appointment
- **URL**: \`/appointments\`
- **Method**: \`POST\`
- **Auth Required**: Yes (Logged in user)
- **Body**:
  \`\`\`json
  {
    "therapistId": "uuid-here",
    "date": "2026-03-15",
    "time": "10:00 AM"
  }
  \`\`\`

### Get My Appointments
- **URL**: \`/appointments/my-appointments\`
- **Method**: \`GET\`
- **Auth Required**: Yes (Logged in user)

### Cancel Appointment
- **URL**: \`/appointments/:id/cancel\`
- **Method**: \`PATCH\`
- **Auth Required**: Yes (Logged in user - can only cancel your own)

### Get All Appointments (Admin / Doctor)
- **URL**: \`/appointments\`
- **Method**: \`GET\`
- **Auth Required**: Yes (Admin or Doctor)

### Update Appointment Status (Admin / Doctor)
- **URL**: \`/appointments/:id\`
- **Method**: \`PATCH\`
- **Auth Required**: Yes (Admin or Doctor)
- **Body**:
  \`\`\`json
  {
    "status": "confirmed" // 'pending', 'confirmed', 'completed', 'cancelled'
  }
  \`\`\`

---

## 4. AI Assistant (\`/ai\`)

### Chat with Mental Health AI
- **URL**: \`/ai/chat\`
- **Method**: \`POST\`
- **Auth Required**: Yes 
- **Notes**: Includes automatic emergency/crisis detection and rate limiting.
- **Body**:
  \`\`\`json
  {
    "message": "I am feeling super anxious today about my upcoming presentation."
  }
  \`\`\`

---

## 5. Wellness Challenges (\`/challenges\`)

### Get All Challenges
- **URL**: \`/challenges\`
- **Method**: \`GET\`
- **Auth Required**: No

### Join a Challenge
- **URL**: \`/challenges/:id/join\`
- **Method**: \`POST\`
- **Auth Required**: Yes

### Update Challenge Progress
- **URL**: \`/challenges/:id/progress\`
- **Method**: \`PATCH\`
- **Auth Required**: Yes
- **Body**:
  \`\`\`json
  {
    "completedDays": 5
  }
  \`\`\`

### Get My Joined Challenges & Progress
- **URL**: \`/challenges/my/progress\`
- **Method**: \`GET\`
- **Auth Required**: Yes

### Create Challenge (Admin)
- **URL**: \`/challenges\`
- **Method**: \`POST\`
- **Auth Required**: Yes (Admin)
- **Body**:
  \`\`\`json
  {
    "title": "30-Day Mindfulness",
    "description": "Meditate daily...",
    "duration": 30
  }
  \`\`\`

---

## 6. Support Resources (\`/support\`)

### Get All Resources
- **URL**: \`/support\`- **Method**: `GET`
- **Auth Required**: No

### Create Resource (Admin Only)
- **URL**: `/support`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Body**:
  ```json
  {
    "name": "Crisis Text Line",
    "phone": "Text HOME to 741741",
    "category": "Crisis"
  }
  ```

### Delete Resource (Admin Only)
- **URL**: `/support/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)

---

## 7. Admin Insights & Knowledge Base (`/admin`)

### Get Platform Statistics
- **URL**: `/admin/stats`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)

### Get All Users
- **URL**: `/admin/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin)
- **Query Parameters**: `role`, `search`

### Update User Role
- **URL**: `/admin/users/:id/role`
- **Method**: `PATCH`
- **Auth Required**: Yes (Admin)
- **Body**:
  ```json
  { "role": "doctor" }
  ```

### Delete User
- **URL**: `/admin/users/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin)

### Upload RAG Document
- **URL**: `/admin/documents`
- **Method**: `POST`
- **Auth Required**: Yes (Admin)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: The document file (.txt, .pdf, .docx, .ppt) to be parsed, chunked, embedded, and stored for the AI medical assistant.
  - Returns document info alongside `chunksProcessed`.
- **Method**: \`GET\`
- **Auth Required**: No
- **Query Parameter** (optional):
  - \`category=Crisis\`

### Create Resource (Admin)
- **URL**: \`/support\`
- **Method**: \`POST\`
- **Auth Required**: Yes (Admin)
- **Body**:
  \`\`\`json
  {
    "name": "Crisis Text Line",
    "phone": "Text HOME to 741741",
    "category": "Crisis"
  }
  \`\`\`

### Delete Resource (Admin)
- **URL**: \`/support/:id\`
- **Method**: \`DELETE\`
- **Auth Required**: Yes (Admin)

---

## Real-Time Sockets (Chat)
Connect to \`http://localhost:5000\` using \`socket.io-client\`

1. **Join Room**:
   \`\`\`javascript
   socket.emit('join_room', { roomId: 'unique-room-id' });
   \`\`\`

2. **Send Message**:
   \`\`\`javascript
   socket.emit('send_message', { 
     roomId: 'unique-room-id', 
     senderId: 'user-id', 
     receiverId: 'therapist-id',
     message: 'Hello Doctor' 
   });
   \`\`\`

3. **Receive Message**:
   \`\`\`javascript
   socket.on('receive_message', (data) => {
     console.log(data); // { senderId, receiverId, message, createdAt }
   });
   \`\`\`
