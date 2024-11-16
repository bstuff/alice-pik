import { ActionFunction, json, LoaderFunction } from '@remix-run/cloudflare';
import { getTokenKvKey } from '~/pik-intercom/utils/kvKeys';
import { getUser } from '~/utils/auth';

export const loader = (async ({ request, context }) => {
  const user = await getUser({ request, context });
  if (!user) {
    throw json({ token: null });
  }

  return json({ token: await context.env.USERS.get(getTokenKvKey(user.uid)) });
}) satisfies LoaderFunction;

export const action = (async ({ request, context }) => {
  if (request.method !== 'DELETE') {
    throw new Response(null, { status: 405 });
  }

  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 403 });
  }

  await context.env.USERS.delete(getTokenKvKey(user.uid));

  return json(null);
}) satisfies ActionFunction;
