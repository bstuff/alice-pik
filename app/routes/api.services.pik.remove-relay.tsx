import { ActionFunction, json } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
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

  const storedRelays = await fetchStoredRelays({ request, context });

  const relayToStore = storedRelays.filter((it) => it.id !== id);
  await context.env.USERS.put(storedRelaysKey(user.uid), JSON.stringify(relayToStore));

  return json(null);
}) satisfies ActionFunction;
