import { io } from 'socket.io-client';
import API_BASE from './api';

let socket;
export function connectSocket() {
  if (socket) return socket;
  // strip trailing slash
  const url = API_BASE.replace(/\/$/, '');
  socket = io(url, { autoConnect: true });
  socket.on('connect', () => console.log('Socket connected', socket.id));
  socket.on('connect_error', (err) => console.warn('Socket connect error', err.message));
  return socket;
}

export function getSocket(){
  if (!socket) throw new Error('Socket not connected, call connectSocket() first');
  return socket;
}

// Cleanly tear down the socket connection (e.g. on admin logout) so we don't
// leak an open connection or duplicate listeners on the next connectSocket() call.
export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = undefined;
  }
}
