import { LoaderFunction } from '@remix-run/cloudflare';
import { getUser } from '~/utils/auth';

export const loader = (async ({ request, context }) => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  return null;
}) satisfies LoaderFunction;
