import { ActionFunction, json } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { fetchRelaysMiddleware } from '~/pik-intercom/utils/fetchRelaysMiddleware';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';
import { storedRelaysKey } from '~/pik-intercom/utils/kvKeys';
import { getUser } from '~/utils/auth';

export type StoreRelaysRequestParams = {
  id: number;
};

export const action = (async ({ request, context }) => {
  const { id } = await request.json<StoreRelaysRequestParams>();
  const user = await getUser({ request, context });
  invariant(user?.uid && id);

  const relays = await fetchRelaysMiddleware({ request, context });
  const storedRelays = await fetchStoredRelays({ request, context });

  const relayToStore = relays.find((it) => it.id === id);
  if (relayToStore && !storedRelays.find((it) => it.id === id)) {
    storedRelays.push(relayToStore);

    await context.env.USERS.put(storedRelaysKey(user.uid), JSON.stringify(storedRelays));
  }

  return json(null);
}) satisfies ActionFunction;
