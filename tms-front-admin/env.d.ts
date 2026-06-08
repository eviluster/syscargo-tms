// src/env.d.ts
/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_MAPS_KEY?: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DEMO: string;
  readonly VITE_APP_FULL_NAME: string;
  readonly VITE_APP_DOCS_LINK: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_BOOTSTRAP_DOCS_LINK: string;
  readonly VITE_APP_SASS_COMPONENTS_PATH: string;
  readonly VITE_APP_PREVIEW_LINK: string;
  readonly VITE_APP_PURCHASE_LINK: string;
  readonly VITE_APP_YOUTUBE_LINK: string;
  readonly VITE_APP_GITHUB_LINK: string;
  readonly VITE_APP_TWITTER_LINK: string;
  readonly VITE_APP_INSTAGRAM_LINK: string;
  readonly VITE_APP_FACEBOOK: string;
  readonly VITE_APP_DRIBBBLE: string;

  // …
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
