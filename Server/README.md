# HerSpace Backend API

Production-ready Node.js backend for HerSpace - A Mental Health Therapy Platform for Women.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 👩‍⚕️ **Therapist Management**: Browse, filter, and book therapist sessions
- 📅 **Appointment System**: Book, manage, and track therapy appointments
- 💬 **Real-time Chat**: WebSocket-based doctor-patient messaging with Socket.IO
- 🤖 **AI Mental Health Assistant**: Google Generative AI (Gemini) integration with crisis detection
- 🎯 **Wellness Challenges**: Join and track progress on mental health challenges
- 📞 **Support Resources**: Emergency and crisis support hotlines database
- 🛡️ **Security**: Helmet, CORS, rate limiting, input validation with Zod
- 📊 **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **AI**: Google Generative AI (Gemini 1.5)
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js            # Seed data script
├── src/
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── therapistController.js
│   │   ├── appointmentController.js
│   │   ├── challengeController.js
│   │   ├── supportController.js
│   │   └── aiController.js
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── therapistRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── challengeRoutes.js
│   │   ├── supportRoutes.js
│   │   └── aiRoutes.js
│   ├── services/         # Business logic
│   │   └── aiService.js
│   ├── sockets/          # WebSocket handlers
│   │   └── chatSocket.js
│   ├── utils/            # Utility functions
│   │   ├── jwt.js
│   │   └── catchAsync.js
│   ├── validations/      # Zod schemas
│   │   ├── auth.validation.js
│   │   ├── appointment.validation.js
│   │   ├── therapist.validation.js
│   │   ├── challenge.validation.js
│   │   └── ai.validation.js
│   └── server.js         # Entry point
├── .env                  # Environment variables
└── package.json
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (or Neon account)
- Google Gemini API key

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the server root:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your_gemini_api_key_here
   CLIENT_URL=http://localhost:5173
   ```

3. **Setup database**:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed database with sample data
   npm run seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   Server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/register` | Register new user | No |
| POST   | `/login` | Login user | No |
| GET    | `/me` | Get current user | Yes |

### Therapists (`/api/therapists`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET    | `/` | Get all therapists | No | - |
| GET    | `/:id` | Get single therapist | No | - |
| POST   | `/` | Create therapist | Yes | Admin |
| PATCH  | `/:id` | Update therapist | Yes | Admin |
| DELETE | `/:id` | Delete therapist | Yes | Admin |

### Appointments (`/api/appointments`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST   | `/` | Create appointment | Yes | Patient |
| GET    | `/my-appointments` | Get user's appointments | Yes | Patient |
| GET    | `/:id` | Get single appointment | Yes | Patient |
| PATCH  | `/:id/cancel` | Cancel appointment | Yes | Patient |
| GET    | `/` | Get all appointments | Yes | Admin/Doctor |
| PATCH  | `/:id` | Update appointment status | Yes | Admin/Doctor |

### Challenges (`/api/challenges`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET    | `/` | Get all challenges | No | - |
| GET    | `/:id` | Get single challenge | No | - |
| POST   | `/:id/join` | Join challenge | Yes | Patient |
| PATCH  | `/:id/progress` | Update progress | Yes | Patient |
| GET    | `/my/progress` | Get user's progress | Yes | Patient |
| POST   | `/` | Create challenge | Yes | Admin |
| DELETE | `/:id` | Delete challenge | Yes | Admin |

### Support Resources (`/api/support`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET    | `/` | Get all resources | No | - |
| GET    | `/:id` | Get single resource | No | - |
| POST   | `/` | Create resource | Yes | Admin |
| PATCH  | `/:id` | Update resource | Yes | Admin |
| DELETE | `/:id` | Delete resource | Yes | Admin |

### AI Assistant (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/chat` | Chat with AI assistant | Yes |

## WebSocket Events

### Chat Socket

Connect to: `http://localhost:5000`

**Client Events:**
- `join_room`: Join a chat room
  ```javascript
  socket.emit('join_room', { roomId: 'user1_user2' });
  ```

- `send_message`: Send a message
  ```javascript
  socket.emit('send_message', {
    roomId: 'user1_user2',
    senderId: 'user1_id',
    receiverId: 'user2_id',
    message: 'Hello!'
  });
  ```

**Server Events:**
- `receive_message`: Receive a new message
  ```javascript
  socket.on('receive_message', (data) => {
    console.log(data); // { senderId, message, createdAt }
  });
  ```

## Database Schema

### Models

- **User**: Patient/Doctor/Admin users
- **Therapist**: Therapist profiles with specializations
- **Appointment**: Booking records between users and therapists
- **Message**: Chat messages between users
- **Challenge**: Wellness challenges
- **ChallengeProgress**: User progress on challenges
- **SupportResource**: Crisis hotlines and resources

## Seed Data

The seed script creates:
- 3 users (2 patients, 1 admin)
- 5 therapists (including 1 free support therapist)
- 4 wellness challenges
- 7 support resources
- 2 sample appointments
- 3 challenge progress records

**Default Credentials:**
- Patient: `sarah@example.com` / `password123`
- Patient: `emily@example.com` / `password123`
- Admin: `admin@herspace.com` / `password123`

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: Zod schemas on all endpoints
- **Role-Based Access**: Admin/Doctor/Patient permissions

## AI Assistant Features

- Mental health conversation with Gemini AI
- Crisis keyword detection
- Automatic emergency resource suggestions
- Rate-limited to prevent abuse
- Women-focused mental health support

## Development

### Useful Commands

```bash
# Run development server with auto-reload
npm run dev

# Generate Prisma Client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database
npm run seed

# Production start
npm start
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret for JWT signing | - |
| JWT_EXPIRES_IN | JWT expiration time | 90d |
| GEMINI_API_KEY | Google Gemini API key | - |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## Error Handling

All errors are centralized through the error handler middleware. Responses follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues or questions, please contact the development team.

---

Built with ❤️ for women's mental health
