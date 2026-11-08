import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { testDatabaseConnection } from './config/database.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO for real-time exam telemetry & proctoring alerts
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);

  // Candidate joins active exam proctoring room
  socket.on('join-exam-room', ({ examId, userId }) => {
    socket.join(`exam_${examId}`);
    logger.info(`Student ${userId} joined proctoring room exam_${examId}`);
  });

  // Client logs window blur / tab switch event
  socket.on('proctor-event', ({ examId, userId, eventType, timestamp }) => {
    logger.warn(`Proctoring alert in exam ${examId}: User ${userId} triggered ${eventType} at ${timestamp}`);
    // Broadcast anomaly warning back to student and proctor admin
    socket.emit('proctor-warning', {
      message: 'Attention: Switching windows is strictly prohibited and logged on your official audit record.',
      warningCount: 1
    });
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// Export io instance for use in controllers/services if needed
export { io };

// Boot Server
async function startServer() {
  await testDatabaseConnection();

  server.listen(PORT, () => {
    logger.success(`Quentrix AI Engine running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
    logger.info(`API Base URL: http://localhost:${PORT}/api`);
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

