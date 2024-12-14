import { AppLoadContext, logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler, RequestHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { QueryClient } from '@tanstack/react-query';
import { PostHog } from 'posthog-node';
import { POSTHOG_HOST, POSTHOG_KEY } from '~/config';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest: RequestHandler<AppLoadContext['env']> = async (eventContext) => {
  const posthog = new PostHog(POSTHOG_KEY, {
    disabled: process.env.ENVIRONMENT !== 'production',
    host: POSTHOG_HOST,
  });

  const _onRequest = createPagesFunctionHandler<AppLoadContext['env']>({
    build,
    async getLoadContext({ context }) {
      // Create a client
      const queryClient = new QueryClient();

      return {
        env: context.cloudflare.env,
        waitUntil: context.cloudflare.waitUntil,
        queryClient,
        posthog,
      };
    },
    mode: build.mode,
  });

  const res = await _onRequest(eventContext);

  eventContext.waitUntil(posthog.shutdown());

  return res;
};
