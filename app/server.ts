import { AppLoadContext, logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { QueryClient } from '@tanstack/react-query';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler<AppLoadContext['env']>({
  build,
  async getLoadContext({ context }) {
    // Create a client
    const queryClient = new QueryClient();

    return {
      env: context.cloudflare.env,
      waitUntil: context.cloudflare.waitUntil,
      queryClient,
    };
  },
  mode: build.mode,
});
