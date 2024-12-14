/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import '@remix-run/server-runtime';
import type { QueryClient } from '@tanstack/react-query';
import type { PostHog } from 'posthog-node';

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: {
      [x: string]: string;

      USERS: KVNamespace;
      ASSETS: Fetcher;

      ADMIN_PASSWORD: string;
      ENVIRONMENT: 'production' | 'preview';
      JWT_SECRET: string;
      YA_OAUTH_CLIENT_ID:string;
      YA_OAUTH_CLIENT_SECRET:string;
      POSTHOG_HOST:string;
      POSTHOG_KEY:string;
    };
    queryClient: QueryClient;
    posthog: PostHog;
    waitUntil: (promise: Promise<unknown>) => void;
  }
}
