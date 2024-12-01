import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getTokenKvKey } from './kvKeys';
import { newPikToken } from './newPikToken';

export async function storePikToken(
  context: LoaderFunctionArgs['context'],
  userId: number,
  token: NonNullable<Awaited<ReturnType<typeof newPikToken>>>,
) {
  return await context.env.USERS.put(getTokenKvKey(userId), token.authHeader!, {
    expiration: token.payload.exp,
  });
}
