// client/src/utils/api.js
// Centralized API base for the client. Picks the first available env var and falls back to localhost.
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.API_BASE_URL ||
  'http://localhost:8500';

export default API_BASE;
