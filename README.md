# Tsinat

**Live Demo:** [tsinat.netlify.app](https://tsinat.netlify.app)

Tsinat is a comprehensive web platform designed to provide accessible mental health support and counseling. It connects users (patients) with professional therapists and spiritual leaders, featuring real-time chat, video consultations, AI-assisted therapy, and personal well-being challenges.

## 🚀 Features

- **User Roles:** Distinct roles including Patients, Doctors (Therapists), Spiritual Leaders, and Admins.
- **Consultation Booking:** Schedule and manage appointments with specialists.
- **Video & Chat:** Real-time chat messaging and integrated video calls for remote therapy sessions.
- **AI Assistant:** Integration with Google Generative AI & Langchain to provide AI-driven assistance using Retrieval-Augmented Generation (RAG) with PostgreSQL vector embeddings.
- **Payment Integration:** Secure checkout flow for paid appointments with platform commission tracking.
- **Free Support Resources:** Accessible crisis resources and free support options from specific therapists.
- **Wellness Challenges:** Interactive daily challenges with progress tracking to encourage positive habits.
- **Multi-language Support:** Internationalization (i18n) for AM, EN, OM, SO, and TI locales.
- **Responsive Dashboard:** Tailored dashboards for users, doctors, and admins.

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 (built with Vite)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS
- **State Management:** Zustand & React Context
- **Real-time Communication:** Socket.IO Client & WebRTC (for video calls)

### Backend
- **Runtime:** Node.js with Express.js
- **Database ORM:** Prisma
- **Database Engine:** PostgreSQL (utilizing `pgvector` extension for AI functionality)
- **Real-time Communication:** Socket.IO
- **AI Capabilities:** `@google/generative-ai`, Langchain
- **Authentication:** JWT (JSON Web Tokens) & bcrypt

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database with the `pgvector` extension installed.

### 1. Clone the repository
Navigate into the project's root folder:
```bash
cd The-Hedy-s
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Server` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/herspace?schema=public"
   JWT_SECRET="your_jwt_secret"
   # Add your Google Gemini API key and other secrets here
   ```
4. Run Prisma database migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_API_BASE_URL="http://localhost:5000/api"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Structure

The PostgreSQL database relies heavily on Prisma schemas to manage relationships. Key entities include:
- **User:** Manages patients and their general platform usage.
- **Therapist / SpiritualLeader:** Specialized models handling availability, pricing, bio, and approval status.
- **Appointment & Transaction:** Tracks booking schedules, statuses, payments, and platform commissions.
- **Message:** Handles peer-to-peer real-time chat histories.
- **Challenge & ChallengeProgress:** Keeps track of gamified well-being routines.
- **Document & DocumentChunk:** Stores RAG context utilizing vector embeddings for the AI Assistant.

---
*Created for Tsinat — Empowering mental well-being.*