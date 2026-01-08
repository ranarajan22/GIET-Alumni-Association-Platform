import axios from 'axios';
import { API_BASE_URL } from './config';

// Normalize API URLs so hard-coded localhost calls get rewritten to the configured backend
const normalizeUrl = (url) => {
  if (!url) return url;

  if (/^https?:\/\/localhost:8083/i.test(url)) {
    return `${API_BASE_URL}${url.replace(/^https?:\/\/localhost:8083/i, '')}`;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
};

axios.defaults.withCredentials = false;

axios.interceptors.request.use((config) => {
  const nextConfig = { ...config };
  nextConfig.url = normalizeUrl(nextConfig.url);
  return nextConfig;
});
