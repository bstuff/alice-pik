import { json, LoaderFunction } from '@remix-run/cloudflare';
import { fetchRelaysMiddleware } from '~/pik-intercom/utils/fetchRelaysMiddleware';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';

export const loader = (async ({ request, context }) => {
  const storedRelays = await fetchStoredRelays({ request, context });
  const storedIds = new Set(storedRelays.map((it) => it.id));

  const relays = (await fetchRelaysMiddleware({ request, context })).sort(
    (a, b) => Number(storedIds.has(b.id)) - Number(storedIds.has(a.id)),
  );

  return json({ relays });
}) satisfies LoaderFunction;
