// client/src/utils/api.js
// Centralized API base for the client.
//
// Vite only exposes env vars to client code when they're prefixed with
// VITE_ (see client/.env.example) — VITE_API_BASE_URL and the unprefixed
// API_BASE_URL that used to be checked here were both always undefined in
// the browser and never actually did anything.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8500';

export default API_BASE;
