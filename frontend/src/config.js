// Shared runtime configuration for API and socket connections
// Default API base points directly to the backend API prefix for consistency
const fallbackApiUrl =
  typeof window !== 'undefined' && window.__API_BASE_URL__
    ? window.__API_BASE_URL__
    : import.meta.env.MODE === 'production'
    ? 'https://giet-alumni-association-platform.onrender.com/api'
    : 'http://localhost:8083/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || fallbackApiUrl;
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;
