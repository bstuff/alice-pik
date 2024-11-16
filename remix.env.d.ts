/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import '@remix-run/server-runtime';
import type { QueryClient } from '@tanstack/react-query';

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: {
      [x: string]: string;

      USERS: KVNamespace;
      ASSETS: Fetcher;

      ADMIN_PASSWORD: string;
      ENVIRONMENT: 'production' | 'preview';
      JWT_SECRET: string;
    };
    queryClient: QueryClient;
    waitUntil: (promise: Promise<unknown>) => void;
  }
}
