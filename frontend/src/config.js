// Shared runtime configuration for API and socket connections
// Normalize URLs to avoid accidental double slashes and trailing slashes
const normalizeUrl = (url) =>
  (url || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/\/+$/, '');

// Default to the backend origin (no /api here). We append /api where needed below.
const fallbackApiOrigin =
  typeof window !== 'undefined' && window.__API_BASE_URL__
    ? window.__API_BASE_URL__
    : import.meta.env.MODE === 'production'
    ? 'https://giet-alumni-association-platform.onrender.com'
    : 'http://localhost:8083';

// API_ORIGIN is the backend root; API_BASE_URL appends /api for REST calls
export const API_ORIGIN = normalizeUrl(import.meta.env.VITE_API_BASE_URL) || normalizeUrl(fallbackApiOrigin);
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const SOCKET_BASE_URL = normalizeUrl(import.meta.env.VITE_SOCKET_URL) || API_ORIGIN;
