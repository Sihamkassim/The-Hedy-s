---
marp: true
theme: default
paginate: true
backgroundColor: #fbf8fc
---

# HerSpace
## A Holistic Women's Mental Health & Wellness Platform
**Project by: The Hedy's**

---

# The Problem
### Culturally Sensitive Mental Healthcare
- **Stigma & Accessibility:** Traditional mental health care can be stigmatized or inaccessible for many women.
- **Fragmented Care:** Clinical therapy and spiritual guidance are rarely integrated, despite many people relying on both.
- **Isolation:** Users often lack a safe, non-judgmental space for daily check-ins and community growth.
- **Cultural Context:** Generic platforms lack localized support, culturally relevant content, and flexible payment systems.

---

# The Solution: HerSpace
### A Safe Space for Your Mind to Breathe
HerSpace is a mobile-first, comprehensive mental health platform designed specifically for women. It bridges the gap between clinical therapy, spiritual wellness, and AI-driven daily support.

**Core Pillars:**
1. Discover & Book Professionals (Clinical & Spiritual)
2. 24/7 AI Companion & Crisis Detection
3. Interactive Wellness Challenges
4. Seamless Telehealth & Real-time Chat

---

# 1. Dual-Track Provider Booking
### Therapy Meets Spiritual Guidance
- **Therapists & Psychologists:** Access to licensed clinical professionals for evidence-based care.
- **Spiritual Leaders:** Culturally integrated option allowing users to book sessions with religious and spiritual guides (Orthodox, Islamic, Protestant, etc.).
- **Unified Interface:** Users seamlessly filter, discover, and book both types of providers using a unified scheduling system.
- **Localized Presence:** Custom-seeded Ethiopian provider network and localized pricing.

---

# 2. Daily AI Companion
### 24/7 Support with Crisis Guardrails
- **Empathetic AI:** An always-on conversational agent built to listen without judgment.
- **Persistent Memory:** Chat history is saved locally (via Zustand) ensuring users don't lose context.
- **Crisis Detection:** Advanced prompt engineering that actively monitors for self-harm or emergencies.
- **Automatic Escalation:** Automatically provides immediate local crisis hotlines (e.g., Ethiopian Toll-Free Crisis Line) if dangerous keywords are detected.

---

# 3. Wellness Challenges
### Actionable, Gamified Self-Care
- **Curated Journeys:** Join pre-built mental health challenges (e.g., "21-Day Gratitude Practice", "14-Day Self-Care Reset").
- **Progress Tracking:** Interactive dashboards allowing patients to track their daily mental health journey.
- **Community:** See how many other users are participating in the same challenge to build a sense of shared growth.

---

# 4. Telehealth & Communication
### Connecting Patients and Providers
- **Real-Time Messaging:** Fully integrated P2P chat system powered by Socket.io.
- **Provider Dashboards:** Granular views allowing providers (both Doctors and Spiritual Leaders) to manage their schedules and patient list.
- **Video Call Integration:** One-click WebRTC/Video Room generation allowing instant, secure telehealth sessions directly from the chat interface.

---

# 5. Accessibility & Inclusivity
### Built for Everyone
- **Free Support:** Dedicated "Free Help" tier for users who cannot afford sessions, highlighting verified free providers and NGOs.
- **Localized Mobile Payments:** Schema architecture built specifically to accommodate local fintech (M-Pesa integration) for automated transaction verification and checkout.
- **Mobile-First Design:** Fully responsive UI engineered to work perfectly on standard mobile devices and tablets.

---

# 6. Dynamic UX & Theming
### Personalizing the Safe Space
Users have complete control over the visual atmosphere of the app to suit their sensory preferences:
- **Calm Lavender (Default):** Soft purples representing tranquility.
- **Warm Earth:** Grounded, earthy tones for stability.
- **Nature Green:** Organic, healing moss and sage colors.
- **Empower Pink:** Vibrant, uplifting pinks.
- **Dark Mode Support:** Every theme features a bespoke, high-contrast Dark Mode seamlessly integrated.

---

# 7. Technical Architecture
### Robust, Modern Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Zustand (State Management), React Router.
- **Backend:** Node.js, Express.js.
- **Database & ORM:** PostgreSQL (hosted on Neon), Prisma ORM.
- **Real-time:** Socket.io for messaging and WebRTC signaling.
- **AI Integration:** Google Gemini API integration with Vector RAG (Retrieve and Generate) capabilities for automated document analysis.

---

# 8. Database Schema Highlights
### Relational & Scalable
- **Polymorphic Appointments:** `Appointment` models securely link to either `Therapist` or `SpiritualLeader`.
- **Transactions:** A dedicated `Transaction` model linking directly to appointments, built to handle `mpesaCheckoutId` and real-time status webhooks.
- **Vector Search Ready:** `DocumentChunk` model prepared with `pgvector` for advanced AI-based semantic queries.

---

# 9. Future Roadmap
### What's Next for HerSpace
1. **M-Pesa Webhook Live Integration:** Complete the end-to-end automated payment flow for appointment confirmations.
2. **Advanced RAG Pipelines:** Fully activate the embedding service to allow the AI to read uploaded medical/therapeutic documents.
3. **Group Therapy Rooms:** Expand video capabilities to support anonymous, moderated group therapy sessions.
4. **Mood Analytics:** Provide users a weekly breakdown of their emotional state based on AI interactions and Challenge completions.

---

# Thank You
### Q&A
*HerSpace - Providing a safe space for your mind to breathe.*