import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { getUser } from '~/utils/auth';
import { storedRelaysKey } from './kvKeys';
import { PikRelay } from './types';

export async function fetchStoredRelays({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'context' | 'request'>) {
  const user = await getUser({ request, context });
  invariant(user?.uid);

  const relays = await context.env.USERS.get(storedRelaysKey(user.uid));

  try {
    return JSON.parse(relays ?? '[]') as PikRelay[];
  } catch (error) {
    console.error(error);

    return [];
  }
}
