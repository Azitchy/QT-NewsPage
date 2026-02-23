import { API_CONFIG } from '../apiConfig';

export { API_CONFIG };

const isDevelopment = import.meta.env.DEV;

export const ENCRYPTION_KEY_STORAGE = 'atm_enc_key';
export const CACHE_PREFIX = 'atm_cache_';
export const CACHE_TTL = 86400000;
export const SIGNATURE_CACHE_KEY = 'atm_withdrawal_signatures_cache';
export const SIGNATURE_CACHE_DURATION = 10 * 60 * 1000;
export const USE_CACHED_SIGNATURES = 1;

export const shouldUseCredentials = () => !isDevelopment;
export { isDevelopment };
