const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { createServer } = require('http');
const { PrismaClient } = require('@prisma/client');
const { initSocket } = require('./sockets/chatSocket');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

// Initialize Socket.IO
initSocket(httpServer);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/therapists', require('./routes/therapistRoutes'));
app.use('/api/spiritual-leaders', require('./routes/spiritualLeaderRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to HerSpace API' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
