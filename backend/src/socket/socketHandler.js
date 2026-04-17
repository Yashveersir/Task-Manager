const setupSocket = (io) => {
  // Track connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    const emitOnlineCount = (teamId) => {
      if (!teamId) return;
      const count = Array.from(connectedUsers.values()).filter(u => u.teamId === teamId.toString()).length;
      io.to(teamId.toString()).emit('users:online', count);
    };

    // Register user with their socket and join their team room
    socket.on('user:register', ({ userId, teamId }) => {
      if (!userId || !teamId) return;
      
      // Store user data
      connectedUsers.set(userId, { socketId: socket.id, teamId: teamId.toString() });
      socket.join(teamId.toString());
      
      console.log(`👤 User ${userId} registered with socket ${socket.id} in team ${teamId}`);

      // Broadcast online users count to the same team room
      emitOnlineCount(teamId);
    });

    // Handle task drag-and-drop status change (if sent from client directly)
    socket.on('task:move', (data) => {
      if (data.teamId) {
        socket.to(data.teamId.toString()).emit('task:status-changed', data);
      }
    });

    // Handle typing indicator (for collaborative editing)
    socket.on('user:typing', (data) => {
      if (data.teamId) {
        socket.to(data.teamId.toString()).emit('user:typing', data);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      let teamIdToNotify = null;

      // Remove user from connected list and identify their team
      for (const [userId, data] of connectedUsers.entries()) {
        if (data.socketId === socket.id) {
          teamIdToNotify = data.teamId;
          connectedUsers.delete(userId);
          break;
        }
      }

      if (teamIdToNotify) {
        emitOnlineCount(teamIdToNotify);
      }

      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupSocket };
