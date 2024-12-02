import type {
  ErrorResponse,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  TypedResponse,
} from '@remix-run/cloudflare';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { Suspense } from 'react';

import appStylesHref from './index.css';
import { getUser } from './utils/auth';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: appStylesHref },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'shortcut icon', href: '/favicon-96x96.png', type: 'image/x-icon' },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'Умный дом с Алисой x Пик Домофон' },
    {
      name: 'description',
      content: `Платформа для управления дверьми от пик домофона из браузера или при помощи умной колонки яндекс`,
    },
  ];
};

export type ServerData = {
  user: Awaited<ReturnType<typeof getUser>>;
  now: number;
  version: string;
};

export const loader = (async ({ request, context }): Promise<TypedResponse<ServerData>> => {
  const user = await getUser({ request, context });

  return json({
    user,
    now: Date.now(),
    version: new Date(process.env.BUILT_AT || 0).toISOString().slice(0, 10),
  });
}) satisfies LoaderFunction;

export const ErrorBoundary = () => {
  const error = useRouteError() as ErrorResponse;

  return <div>{error?.statusText || 'Something went wrong'}</div>;
};

export default function App() {
  const { version } = useLoaderData<ServerData>();

  return (
    <html lang="en" className="bg-base-100 text-base-content" data-version={version}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className={`bg-base-100 text-base-content`}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
        <ScrollRestoration />
        <script dangerouslySetInnerHTML={{ __html: `/*_rq_state_*/` }} suppressHydrationWarning />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
