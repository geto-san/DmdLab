import { io } from 'socket.io-client';

let socket;
export function connectSocket() {
  if (socket) return socket;
  const base = import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL || 'http://localhost:8500';
  // strip trailing slash
  const url = base.replace(/\/$/, '');
  socket = io(url, { autoConnect: true });
  socket.on('connect', () => console.log('Socket connected', socket.id));
  socket.on('connect_error', (err) => console.warn('Socket connect error', err.message));
  return socket;
}

export function getSocket(){
  if (!socket) throw new Error('Socket not connected, call connectSocket() first');
  return socket;
}
