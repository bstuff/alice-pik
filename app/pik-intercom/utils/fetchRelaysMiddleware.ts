import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { fetchRelays } from '~/pik-intercom/utils/fetchRelays';
import { getPikToken } from '~/pik-intercom/utils/getPikToken';
import { getUser } from '~/utils/auth';
import { pikRelaysKey } from './kvKeys';
import { PikRelay } from './types';

const KEY_GET_TOKEN = Symbol('fetchRelays');

export async function fetchRelaysMiddleware({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'context' | 'request'>): Promise<PikRelay[]> {
  const r = context as { [KEY_GET_TOKEN]?: ReturnType<typeof fetchRelaysImpl> };

  return await (r[KEY_GET_TOKEN] ?? (r[KEY_GET_TOKEN] = fetchRelaysImpl({ request, context })));
}

async function fetchRelaysImpl({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'context' | 'request'>): Promise<PikRelay[]> {
  const user = await getUser({ request, context });
  const pikToken = await getPikToken({ request, context });
  invariant(pikToken && user);

  try {
    const res = await context.env.USERS.get(pikRelaysKey(user.uid));
    if (res) {
      const json = JSON.parse(res);

      invariant(Array.isArray(json));
      return json;
    }
  } catch (error) {
    //
  }
  const relays = await fetchRelays(pikToken);

  await context.env.USERS.put(pikRelaysKey(user.uid), JSON.stringify(relays), {
    expirationTtl: 10 * 60,
  });

  return relays;
}
