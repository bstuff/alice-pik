import { RemixBrowser } from '@remix-run/react';
import { hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry(failureCount) {
        return failureCount < 2;
      },
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
  },
});
// @ts-expect-error - hack
if (window.__rqstate) {
  // @ts-expect-error - hack
  hydrate(queryClient, window.__rqstate);
}

startTransition(() => {
  hydrateRoot(
    document,
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    </QueryClientProvider>,
  );
});
