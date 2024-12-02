import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getTokenKvKey, pikRelaysKey } from './kvKeys';
import { newPikToken } from './newPikToken';

export async function storePikToken(
  context: LoaderFunctionArgs['context'],
  userId: number,
  token: NonNullable<Awaited<ReturnType<typeof newPikToken>>>,
) {
  const res = await context.env.USERS.put(getTokenKvKey(userId), token.authHeader!, {
    expiration: token.payload.exp,
  });

  await context.env.USERS.delete(pikRelaysKey(userId));

  return res;
}
