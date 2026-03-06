# HerSpace - Mental Health Therapy Platform for Women 💜

A modern, responsive web application designed to provide mental health support, therapy sessions, and personal growth challenges for women.

## 🌟 Features

### 1. **Landing Page**
- Hero section with mission statement
- Featured therapists and life coaches
- Featured 30-day challenges
- Testimonials from users
- Call-to-action buttons
- Information about free support services

### 2. **Therapists Page**
- Browse licensed therapists and certified life coaches
- Search by name or specialization
- Filter by:
  - Session type (Free/Paid)
  - Specialization
  - Rating
- View therapist profiles with:
  - Name, photo, and bio
  - Specialization and expertise
  - Rating and review count
  - Availability schedule
  - Price per session

### 3. **Booking Page**
- View detailed therapist information
- Select session type (Video Call or In-Person)
- Choose date and time from available slots
- Add optional session notes
- Instant booking confirmation
- Free sessions for crisis support

### 4. **Free Help Page**
Always free support for:
- **Drug Abuse Recovery** - Substance abuse support and rehabilitation
- **Gender-Based Violence Support** - Domestic violence and trauma counseling
- **Emotional Crisis Counseling** - 24/7 crisis intervention and suicide prevention

Features:
- 24/7 crisis hotlines
- List of services offered
- Available specialists for each category
- Direct booking to free sessions

### 5. **Challenges Page**
30-day personal growth challenges:
- **Confidence Boost** - Building self-belief and confidence
- **Self-Love Journey** - Cultivating self-compassion
- **Anxiety Reduction** - Managing anxiety through mindfulness
- **Positive Mindset** - Developing optimistic thinking

Each challenge includes:
- Progress tracking with visual progress bars
- Daily task checklist
- Completion percentage
- Participant count
- Detailed challenge view with daily tasks

### 6. **User Dashboard**
- Quick stats overview (appointments, challenges, progress)
- Upcoming appointments with session details
- Active challenges with progress tracking
- Quick action buttons
- Recommended content
- Crisis support hotline access

## 🎨 Design Features

- **Calming Color Palette**: Light purple, teal, soft pink, and white
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG compliant with proper contrast and keyboard navigation
- **Modern UI**: Clean, calming interface designed for mental health focus
- **Smooth Animations**: Subtle transitions and hover effects

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── TherapistCard.jsx
│   │   └── ChallengeCard.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── TherapistsPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── FreeHelpPage.jsx
│   │   ├── ChallengesPage.jsx
│   │   └── Dashboard.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── api/
│   │   └── axios.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
└── package.json
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📊 Mock Data

The application includes comprehensive mock data:
- **6 therapists** with varied specializations
- **4 challenges** across different mental health areas
- **Sample appointments** with upcoming and completed sessions
- **Free help resources** for crisis support
- **Testimonials** from users

## 🔒 Free Support Categories

These services are ALWAYS free (no payment required):
- Drug abuse recovery and rehabilitation
- Gender-based violence and domestic abuse support
- Emotional crisis counseling and suicide prevention

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key User Flows

1. **Finding a Therapist**: Home → Therapists → Filter/Search → Book Session
2. **Booking a Session**: Therapist Card → Booking Page → Select Date/Time → Confirm
3. **Joining a Challenge**: Home/Challenges → Select Challenge → View Details → Start
4. **Getting Crisis Help**: Free Help → Select Category → View Resources → Book/Call
5. **Tracking Progress**: Dashboard → View Appointments/Challenges → Continue

## 🌐 Navigation

- **Home** - Landing page with overview
- **Therapists** - Browse and filter therapists
- **Challenges** - View and join 30-day challenges
- **Free Help** - Access crisis support services
- **Dashboard** - Personal user dashboard

## 🎨 Color Scheme

- **Purple**: `#8B5CF6` - Primary brand color, trust, wisdom
- **Teal**: `#14B8A6` - Healing, calmness, balance
- **Pink**: `#EC4899` - Compassion, nurturing, warmth
- **White/Gray**: Clean backgrounds and text

## ♿ Accessibility Features

- Semantic HTML elements
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- High contrast text
- Focus indicators
- Screen reader friendly

## 📞 Emergency Resources

Built-in emergency hotlines:
- **988** - Suicide & Crisis Lifeline
- **1-800-799-SAFE** - National Domestic Violence Hotline
- **1-800-662-HELP** - Substance Abuse Helpline

## 🔮 Future Enhancements

- User authentication and profiles
- Real-time video call integration
- Payment processing for paid sessions
- Community forums and group support
- Mobile app version
- Multi-language support
- AI-powered therapist matching

## 📄 License

This project is created for educational and demonstration purposes.

## 💜 Mission

*Providing accessible, compassionate mental health support for women. Because every woman deserves to heal, grow, and thrive.*

---

**Crisis?** Call **988** or visit your nearest emergency room. 
**You are not alone.** 💜
