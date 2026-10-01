/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL canônica do institucional, sem barra no final. Ver vite.config.ts. */
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
