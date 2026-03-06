// Mock data for Mental Health Therapy Platform

export const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Ahmed",
    specialization: "Trauma Therapist",
    rating: 4.8,
    price: "Free",
    priceAmount: 0,
    availability: ["Monday", "Wednesday", "Friday"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Specializing in trauma recovery and PTSD treatment with 10+ years of experience.",
    reviews: 156,
    category: "Gender-based violence support"
  },
  {
    id: 2,
    name: "Dr. Amina Hassan",
    specialization: "Anxiety & Depression Specialist",
    rating: 4.9,
    price: "$50/session",
    priceAmount: 50,
    availability: ["Tuesday", "Thursday", "Saturday"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
    bio: "Expert in cognitive behavioral therapy for anxiety and depression management.",
    reviews: 203,
    category: "General therapy"
  },
  {
    id: 3,
    name: "Coach Maya Johnson",
    specialization: "Life Coach & Confidence Building",
    rating: 4.7,
    price: "$40/session",
    priceAmount: 40,
    availability: ["Monday", "Tuesday", "Friday"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    bio: "Empowering women to discover their inner strength and achieve their goals.",
    reviews: 127,
    category: "Life coaching"
  },
  {
    id: 4,
    name: "Dr. Fatima Al-Zahra",
    specialization: "Addiction Recovery Specialist",
    rating: 4.9,
    price: "Free",
    priceAmount: 0,
    availability: ["Monday", "Wednesday", "Thursday", "Friday"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    bio: "Compassionate support for substance abuse recovery and rehabilitation.",
    reviews: 189,
    category: "Drug abuse recovery"
  },
  {
    id: 5,
    name: "Dr. Zara Williams",
    specialization: "Crisis Counselor",
    rating: 5.0,
    price: "Free",
    priceAmount: 0,
    availability: ["Every day"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara",
    bio: "24/7 emergency emotional crisis support and intervention specialist.",
    reviews: 342,
    category: "Emotional crisis counseling"
  },
  {
    id: 6,
    name: "Coach Lily Chen",
    specialization: "Mindfulness & Meditation Coach",
    rating: 4.8,
    price: "$35/session",
    priceAmount: 35,
    availability: ["Tuesday", "Wednesday", "Saturday"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
    bio: "Guiding women through mindfulness practices for stress reduction and inner peace.",
    reviews: 98,
    category: "Wellness coaching"
  }
];

export const challenges = [
  {
    id: 1,
    title: "30-Day Confidence Boost",
    description: "Daily exercises to build confidence and self-belief through positive affirmations, goal-setting, and self-reflection.",
    progress: 35,
    daysCompleted: 10,
    totalDays: 30,
    icon: "💪",
    color: "purple",
    category: "Self-Esteem",
    dailyTasks: [
      "Write 3 things you're proud of today",
      "Practice power posing for 2 minutes",
      "Compliment yourself in the mirror",
      "Set one small achievable goal"
    ],
    participants: 1234
  },
  {
    id: 2,
    title: "Self-Love Journey",
    description: "Cultivate self-compassion and learn to love yourself unconditionally through mindful practices and self-care routines.",
    progress: 60,
    daysCompleted: 18,
    totalDays: 30,
    icon: "💖",
    color: "pink",
    category: "Self-Care",
    dailyTasks: [
      "Practice positive self-talk",
      "Do one thing that brings you joy",
      "Journal about your strengths",
      "Practice self-forgiveness"
    ],
    participants: 2156
  },
  {
    id: 3,
    title: "Anxiety Reduction Challenge",
    description: "Learn practical techniques to manage anxiety through breathing exercises, mindfulness, and stress management strategies.",
    progress: 20,
    daysCompleted: 6,
    totalDays: 30,
    icon: "🧘‍♀️",
    color: "teal",
    category: "Mental Wellness",
    dailyTasks: [
      "10-minute meditation session",
      "Practice deep breathing exercises",
      "Identify and challenge anxious thoughts",
      "Progressive muscle relaxation"
    ],
    participants: 3421
  },
  {
    id: 4,
    title: "Positive Mindset Transformation",
    description: "Rewire your brain for positivity through gratitude practices, optimistic thinking, and cognitive reframing techniques.",
    progress: 0,
    daysCompleted: 0,
    totalDays: 30,
    icon: "✨",
    color: "yellow",
    category: "Mindset",
    dailyTasks: [
      "List 5 things you're grateful for",
      "Find the silver lining in a challenge",
      "Practice positive affirmations",
      "Share kindness with someone"
    ],
    participants: 1876
  }
];

export const appointments = [
  {
    id: 1,
    therapistId: 2,
    therapistName: "Dr. Amina Hassan",
    date: "2026-03-10",
    time: "10:00 AM",
    status: "upcoming",
    type: "Video Call",
    duration: "50 minutes"
  },
  {
    id: 2,
    therapistId: 3,
    therapistName: "Coach Maya Johnson",
    date: "2026-03-12",
    time: "2:00 PM",
    status: "upcoming",
    type: "In-Person",
    duration: "60 minutes"
  },
  {
    id: 3,
    therapistId: 1,
    therapistName: "Dr. Sarah Ahmed",
    date: "2026-03-05",
    time: "11:00 AM",
    status: "completed",
    type: "Video Call",
    duration: "50 minutes"
  }
];

export const freeHelpResources = [
  {
    id: 1,
    category: "Drug Abuse Recovery",
    title: "Substance Abuse Support",
    description: "Free confidential support for overcoming addiction and building a healthier future.",
    icon: "🌟",
    color: "purple",
    services: [
      "Individual counseling sessions",
      "Group therapy meetings",
      "24/7 crisis hotline",
      "Recovery planning and support",
      "Family counseling"
    ],
    therapists: [1, 4],
    emergencyNumber: "1-800-662-HELP (4357)"
  },
  {
    id: 2,
    category: "Gender-Based Violence Support",
    title: "Domestic Violence & Abuse Support",
    description: "Safe, confidential support for survivors of gender-based violence and domestic abuse.",
    icon: "🛡️",
    color: "teal",
    services: [
      "Trauma-informed counseling",
      "Safety planning assistance",
      "Legal resource referrals",
      "Emergency shelter information",
      "Support groups for survivors"
    ],
    therapists: [1, 5],
    emergencyNumber: "1-800-799-SAFE (7233)"
  },
  {
    id: 3,
    category: "Emotional Crisis Counseling",
    title: "Crisis & Suicide Prevention",
    description: "Immediate support for emotional crises, suicidal thoughts, and mental health emergencies.",
    icon: "💚",
    color: "pink",
    services: [
      "24/7 crisis counseling",
      "Suicide prevention support",
      "Emergency safety planning",
      "Immediate therapist connection",
      "Text and chat support available"
    ],
    therapists: [5],
    emergencyNumber: "988 - Suicide & Crisis Lifeline"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Anonymous",
    text: "This platform gave me the courage to seek help. The free support saved my life.",
    rating: 5,
    category: "Crisis Support"
  },
  {
    id: 2,
    name: "Maria K.",
    text: "The 30-day challenges helped me build confidence I never knew I had. Forever grateful!",
    rating: 5,
    category: "Challenges"
  },
  {
    id: 3,
    name: "Sarah M.",
    text: "Finding a therapist who understood my trauma was life-changing. Thank you for this safe space.",
    rating: 5,
    category: "Therapy"
  }
];

export const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM"
];
