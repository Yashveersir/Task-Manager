import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to server (Support dynamic deployment URL)
    const backendUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : window.location.origin;

    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      // team could be populated object or just ID
      const teamId = user.team?._id || user.team;
      newSocket.emit('user:register', { userId: user._id, teamId });
    });

    newSocket.on('users:online', (count) => {
      setOnlineUsers(count);
    });

    // Listen for notifications
    newSocket.on('notification', (data) => {
      // Only show notification to the assigned user
      if (data.userId === user._id || !data.userId) {
        if (data.type === 'task_assigned') {
          toast(data.message, {
            icon: '📋',
            duration: 5000,
          });
        } else if (data.type === 'task_completed') {
          toast.success(data.message, { duration: 5000 });
        } else {
          toast(data.message, { icon: '🔔' });
        }
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
