// API Configuration with proxy support
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  // In development, use the proxy path. In production, use full URLs
  GAME_API_BASE_URL: isDevelopment ? '/gameapi' : (import.meta.env.VITE_GAME_API_BASE_URL || 'https://gameapi.atm.network'),
  WEB_API_BASE_URL: isDevelopment ? '/api' : (import.meta.env.VITE_WEB_API_BASE_URL || 'https://webapi.atm.network'),
  CLIENT_TYPE: parseInt(import.meta.env.VITE_CLIENT_TYPE || '6'), // 6 = website
  CLIENT_VERSION: parseInt(import.meta.env.VITE_CLIENT_VERSION || '1'),
  DEVICE_ID: parseInt(import.meta.env.VITE_DEVICE_ID || '112233'),
  SESSION_DURATION: parseInt(import.meta.env.VITE_SESSION_DURATION || '86400000'),
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
} as const;

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const getUserDataFromStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getCommonHeaders = () => {
  const token = getTokenFromStorage();
  return {
    'Content-Type': 'application/json',
    ...(token && { token }),
  };
};

export const getAuthHeaders = () => {
  const token = getTokenFromStorage();
  const headers = {
    'Content-Type': 'application/json',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
    ...(token && { token }),
  };
  
  return headers;
};

export const getFormHeaders = () => {
  const token = getTokenFromStorage();
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
    ...(token && { token }),
  };
};