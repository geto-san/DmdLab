const { Server } = require('socket.io');
let io;

function setupSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
  });

  return io;
}

function getIo() {
  if (!io) throw new Error('Socket.IO not initialized - call setupSocket(server) first');
  return io;
}

module.exports = { setupSocket, getIo };
