import { json, LoaderFunction } from '@remix-run/cloudflare';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';

export const loader = (async ({ request, context }) => {
  const relays = await fetchStoredRelays({ request, context });

  return json({ storedRelays: relays });
}) satisfies LoaderFunction;
