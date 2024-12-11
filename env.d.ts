/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_CLAUDE_API_KEY: string;
  readonly VITE_CLAUDE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
