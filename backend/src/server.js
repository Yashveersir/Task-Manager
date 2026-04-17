const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { setupSocket } = require('./socket/socketHandler');

// Load environment variables
dotenv.config();

// Ensure CLIENT_URL doesn't have a trailing slash (Fixes CORS issues)
if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL = process.env.CLIENT_URL.replace(/\/$/, '');
}

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

// Make io accessible in routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - Welcome Page
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white; text-align: center;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(to right, #3b82f6, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TaskFlow API</h1>
      <p style="font-size: 1.25rem; color: #94a3b8; max-width: 600px;">The real-time backend for your collaborative task management system is up and running.</p>
      <div style="margin-top: 2rem; display: flex; gap: 1rem; align-items: center;">
        <div style="padding: 1rem 2rem; border-radius: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
          <code style="color: #60a5fa;">Status: 🟢 Online</code>
        </div>
        <a href="https://task-manager-theta-ten-91.vercel.app/" style="text-decoration: none; padding: 1rem 2rem; border-radius: 1rem; background: #3b82f6; color: white; font-weight: bold; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Go to App &rarr;</a>
      </div>
      <p style="margin-top: 3rem; font-size: 0.875rem; color: #64748b;">&copy; ${new Date().getFullYear()} TaskFlow | Built for Efficiency</p>
    </div>
  `);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup Socket.io handlers
setupSocket(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
