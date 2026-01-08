// Shared runtime configuration for API and socket connections
const fallbackApiUrl =
  typeof window !== 'undefined' && window.__API_BASE_URL__
    ? window.__API_BASE_URL__
    : 'http://localhost:8083';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || fallbackApiUrl;
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;
