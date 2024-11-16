import { ActionFunction, json } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { fetchRelaysMiddleware } from '~/pik-intercom/utils/fetchRelaysMiddleware';
import { storedRelaysKey } from '~/pik-intercom/utils/kvKeys';
import { getUser } from '~/utils/auth';

export type StoreRelaysRequestParams = {
  ids: number[];
};

export const action = (async ({ request, context }) => {
  const { ids } = await request.json<StoreRelaysRequestParams>();
  const user = await getUser({ request, context });
  invariant(user?.uid && ids);

  const relays = await fetchRelaysMiddleware({ request, context });

  const relaysToStore = relays.filter((it) => ids.includes(it.id));
  await context.env.USERS.put(storedRelaysKey(user.uid), JSON.stringify(relaysToStore));

  return json(null);
}) satisfies ActionFunction;
