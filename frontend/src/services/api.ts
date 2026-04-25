import axios from 'axios';

// API Base URL - uses env variable or falls back to current hostname
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : `http://${window.location.hostname}:4000/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ═══════════════════════════════════════════════════════════
// API Endpoints — aligned with backend routes
// ═══════════════════════════════════════════════════════════

// User Authentication
// Backend register expects { name, email, password }
// We transform fullName → name here so the UI can keep using fullName
export const userAPI = {
  register: (data: { fullName: string; email: string; phone: string; password: string }) =>
    apiClient.post('/users/register', {
      name: data.fullName,
      email: data.email,
      password: data.password,
    }),

  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    apiClient.post('/users/login', data),

  forgotPassword: (email: string) =>
    apiClient.post('/users/forgot', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post(`/users/reset/${token}`, { password }),

  verifyEmail: (token: string) =>
    apiClient.get(`/users/verify/${token}`),

  getProfile: () =>
    apiClient.get('/users/me'),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.post('/users/change-password', data),
};

// Properties (CRUD — admin-managed listings)
export const propertiesAPI = {
  getAll: (params?: any, config?: { signal?: AbortSignal }) =>
    apiClient.get('/products/list', { params, ...config }),

  getById: (id: string) =>
    apiClient.get(`/products/single/${id}`),
};

// Appointments (supports guest bookings)
export const appointmentsAPI = {
  schedule: (data: {
    propertyId: string;
    date?: string;
    time?: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
  }) =>
    apiClient.post('/appointments/schedule', data),
};

// AI-Powered Property Search
export const aiAPI = {
  search: (data: {
    city?: string;
    locality?: string;
    bhk?: string;
    possession?: string;
    includeNoBroker?: boolean;
    price?: { min: number; max: number };
    type?: string;
    category?: string;
  }) => {
    const githubKey = localStorage.getItem('Haven Homes_github_key');
    const firecrawlKey = localStorage.getItem('Haven Homes_firecrawl_key');
    return apiClient.post('/ai/search', data, {
      headers: {
        ...(githubKey && { 'X-Github-Key': githubKey }),
        ...(firecrawlKey && { 'X-Firecrawl-Key': firecrawlKey }),
      },
    });
  },

  locationTrends: (city: string) => {
    const githubKey = localStorage.getItem('Haven Homes_github_key');
    const firecrawlKey = localStorage.getItem('Haven Homes_firecrawl_key');
    return apiClient.get(`/locations/${encodeURIComponent(city)}/trends`, {
      headers: {
        ...(githubKey && { 'X-Github-Key': githubKey }),
        ...(firecrawlKey && { 'X-Firecrawl-Key': firecrawlKey }),
      },
    });
  },

  validateKeys: (keys?: { githubKey?: string; firecrawlKey?: string }) => {
    const githubKey = (keys?.githubKey ?? localStorage.getItem('Haven Homes_github_key') ?? '').trim();
    const firecrawlKey = (keys?.firecrawlKey ?? localStorage.getItem('Haven Homes_firecrawl_key') ?? '').trim();

    return apiClient.post('/ai/validate-keys', {}, {
      headers: {
        ...(githubKey && { 'X-Github-Key': githubKey }),
        ...(firecrawlKey && { 'X-Firecrawl-Key': firecrawlKey }),
      },
    });
  },
};

// Helpers to read/write user API keys in localStorage
export const apiKeyStorage = {
  getGithubKey: () => localStorage.getItem('Haven Homes_github_key') || '',
  getFirecrawlKey: () => localStorage.getItem('Haven Homes_firecrawl_key') || '',
  setGithubKey: (key: string) => localStorage.setItem('Haven Homes_github_key', key),
  setFirecrawlKey: (key: string) => localStorage.setItem('Haven Homes_firecrawl_key', key),
  hasKeys: () => !!(localStorage.getItem('Haven Homes_github_key') && localStorage.getItem('Haven Homes_firecrawl_key')),
  clear: () => {
    localStorage.removeItem('Haven Homes_github_key');
    localStorage.removeItem('Haven Homes_firecrawl_key');
  },
};

// YouTube Latest Videos
export const youtubeAPI = {
  getLatestVideos: () => apiClient.get('/youtube/latest'),
};

export default apiClient;
