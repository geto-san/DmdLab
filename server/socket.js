const { Server } = require('socket.io');
let io;

function setupSocket(httpServer, allowedOrigins) {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins && allowedOrigins.length ? allowedOrigins : '*' }
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

// Emits a socket event if Socket.IO has been initialized, silently no-oping
// otherwise (e.g. during startup, or in tests that don't call setupSocket).
// Centralizes the try/getIo().emit/catch pattern that was previously
// repeated at every call site in admin.controller.js.
function safeEmit(event, payload) {
  try {
    getIo().emit(event, payload);
  } catch {
    // socket not ready — not initialized yet, or this call happened outside
    // a request lifecycle (e.g. a script/test) where it's not expected.
  }
}

module.exports = { setupSocket, getIo, safeEmit };
