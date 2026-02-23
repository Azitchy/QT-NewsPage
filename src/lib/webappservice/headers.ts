import { API_CONFIG } from '../apiConfig';

const isDevelopment = import.meta.env.DEV;

/**
 * JSON headers with Cssg-Language (used by OpenAPI, community, income, etc.)
 */
export function getJsonHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
  };
  if (token) headers['token'] = token;
  if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;
  return headers;
}

/**
 * JSON headers minimal — no Cssg-Language (used by GameService getCommonHeaders)
 */
export function getJsonHeadersMinimal(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['token'] = token;
  return headers;
}

/**
 * Form-urlencoded headers with Cssg-Language (used by WebAPIService, form-based calls)
 */
export function getFormHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
  };
  if (token) headers['token'] = token;
  if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;
  return headers;
}

/**
 * AGF headers — token + JSON + cssg-language: en
 */
export function getAGFHeaders(token?: string | null): Record<string, string> {
  return {
    token: token || '',
    'Content-Type': 'application/json',
    'cssg-language': 'en',
  };
}

/**
 * Auth headers for getSignMessage / getLoginToken (form-urlencoded, no token, no Cssg-Language for token field)
 */
export function getOpenApiFormHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
  };
  if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;
  return headers;
}

/**
 * Minimal JSON headers with token + apiToken (no Cssg-Language) — used by withdrawal balance, etc.
 */
export function getTokenJsonHeaders(token: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'token': token,
  };
  if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;
  return headers;
}
