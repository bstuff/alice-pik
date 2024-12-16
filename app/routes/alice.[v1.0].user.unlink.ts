import { ActionFunction, json } from '@remix-run/cloudflare';
import { getUser } from '~/utils/auth';

export const action: ActionFunction = async ({ request, context }) => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  context.posthog.capture({ event: 'Devices/Unlink', distinctId: `ya:${user.uid}` });

  return json(null);
};
