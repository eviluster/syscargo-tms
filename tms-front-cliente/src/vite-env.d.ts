// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // declara aquí todas tus VITE_*
  // readonly VITE_OTRA_VARIABLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
