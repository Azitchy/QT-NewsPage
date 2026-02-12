const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  OPENAPI_BASE_URL: import.meta.env.DEV ? '/openapi' : import.meta.env.VITE_OPENAPI_BASE_URL,
  WEB_API_BASE_URL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_WEB_API_BASE_URL,
  GAME_API_BASE_URL: import.meta.env.DEV ? '/gameapi' : import.meta.env.VITE_GAME_API_BASE_URL,
  API_TOKEN: import.meta.env.VITE_API_TOKEN,
  CLIENT_TYPE: parseInt(import.meta.env.VITE_CLIENT_TYPE || '6'),
  CLIENT_VERSION: parseInt(import.meta.env.VITE_CLIENT_VERSION || '1'),
  DEVICE_ID: parseInt(import.meta.env.VITE_DEVICE_ID || '112233'),
  SESSION_DURATION: parseInt(import.meta.env.VITE_SESSION_DURATION || '86400000'),
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
} as const;


export const getOpenAPIHeaders = () => {
  const token = getTokenFromStorage();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { token }),
  };
  
  if (!import.meta.env.DEV && API_CONFIG.API_TOKEN) {
    headers['apiToken'] = API_CONFIG.API_TOKEN;
  }
  
  return headers;
};

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('atm_token');
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
  return {
    'Content-Type': 'application/json',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
    ...(token && { token }),
  };
};

export const getFormHeaders = () => {
  const token = getTokenFromStorage();
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
    ...(token && { token }),
  };
};

export const shouldUseCredentials = (): boolean => {
  return true; 
};