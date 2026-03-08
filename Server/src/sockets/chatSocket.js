const { Server } = require('socket.io');
const prisma = require('../../config/db');
const { createCorsOriginValidator } = require('../utils/corsOptions');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: createCorsOriginValidator(),
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a message
    socket.on('send_message', async (data) => {
      const { roomId, senderId, receiverId, message } = data;

      try {
        // Save message to database
        const savedMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            message
          }
        });

        // Broadcast to the room
        io.to(roomId).emit('receive_message', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle typing events
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('typing', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
