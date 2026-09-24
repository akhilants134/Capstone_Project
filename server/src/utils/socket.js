const { Server } = require('socket.io');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (process.env.CLIENT_URL || "http://localhost:3000,http://localhost:5173")
        .split(",")
        .map((o) => o.trim()),
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New WebSocket client connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`👤 User joined room: user:${userId}`);
      }
    });

    // Join general category / updates room
    socket.on('join_category', (category) => {
      if (category) {
        socket.join(`category:${category}`);
      }
    });

    // Handle real-time messaging
    socket.on('send_message', (data) => {
      const { recipientId, message, senderName } = data;
      if (recipientId) {
        io.to(`user:${recipientId}`).emit('new_message', {
          senderId: socket.userId || 'anonymous',
          senderName,
          message,
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const emitNotification = (userId, notification) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

const emitNewListing = (category, listing) => {
  if (io) {
    io.to(`category:${category}`).emit('new_listing', listing);
    io.emit('global_listing_update', listing);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitNotification,
  emitNewListing
};
