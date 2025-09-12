// API Configuration
export const API_CONFIG = {
  GAME_API_BASE_URL: import.meta.env.VITE_GAME_API_BASE_URL || 'https://gameapi.atm.network',
  WEB_API_BASE_URL: import.meta.env.VITE_WEB_API_BASE_URL || 'https://webapi.atm.network',
  CLIENT_TYPE: parseInt(import.meta.env.VITE_CLIENT_TYPE || '6'),
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
    'cssg-language': API_CONFIG.DEFAULT_LANGUAGE,
    ...(token && { token }),
  };
  
  // Set cookie for authentication
  if (token) {
    document.cookie = `token=${token}; path=/; samesite=None; secure;`;
  }
  
  return headers;
};

export const getFormHeaders = () => {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
  };
};