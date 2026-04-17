const setupSocket = (io) => {
  // Track connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Register user with their socket and join their team room
    socket.on('user:register', ({ userId, teamId }) => {
      if (!userId || !teamId) return;
      connectedUsers.set(userId, { socketId: socket.id, teamId });
      socket.join(teamId);
      console.log(`👤 User ${userId} registered with socket ${socket.id} in team ${teamId}`);

      // Broadcast online users count conceptually to same team (optional, skipping for now)
    });

    // Handle task drag-and-drop status change (if sent from client directly)
    socket.on('task:move', (data) => {
      if (data.teamId) {
        socket.to(data.teamId).emit('task:status-changed', data);
      }
    });

    // Handle typing indicator (for collaborative editing)
    socket.on('user:typing', (data) => {
      socket.broadcast.emit('user:typing', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Remove user from connected list
      for (const [userId, data] of connectedUsers.entries()) {
        if (data.socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }

      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
