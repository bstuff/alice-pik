import { SerializeFrom } from '@remix-run/cloudflare';
import { useRouteLoaderData } from '@remix-run/react';
import type { loader } from '~/root';

export function useRootLoaderData() {
  return useRouteLoaderData<SerializeFrom<typeof loader>>('root')!;
}
