/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_API_BASE_URL: string;
  readonly VITE_WEB_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_SESSION_DURATION: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_CLIENT_TYPE: string;
  readonly VITE_CLIENT_VERSION: string;
  readonly VITE_DEVICE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}