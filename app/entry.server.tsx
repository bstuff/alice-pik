/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */
import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { redirect, RemixServer } from '@remix-run/react';
import { dehydrate, QueryClientProvider } from '@tanstack/react-query';
// import { isbot } from 'isbot'; // temp disable until we know how streaming api works
import { renderToReadableStream } from 'react-dom/server';

// @ts-expect-error - needed for cf worker
process.version ||= 'v18.0.0';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility. Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  if (new URL(request.url).pathname.length > 1 && request.url.endsWith('/')) {
    return redirect(request.url.slice(0, -1), 301);
  }

  const { queryClient } = loadContext;
  const performanceNow = performance.now();
  const body = await renderToReadableStream(
    <QueryClientProvider client={queryClient}>
      <RemixServer context={remixContext} url={request.url} />
    </QueryClientProvider>,
    {
      signal: request.signal,
    },
  );

  // if (isbot(request.headers.get('user-agent') || '')) {
  await body.allReady;
  // }

  const html = await new Response(body).text();

  const dehydrated = dehydrate(queryClient);

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.append(
    'Server-Timing',
    `app;desc=render;dur=${performance.now() - performanceNow}`,
  );

  return new Response(
    html.replace(`/*_rq_state_*/`, `window.__rqstate = ${JSON.stringify(dehydrated)}`),
    {
      headers: responseHeaders,
      status: responseStatusCode,
    },
  );
}
