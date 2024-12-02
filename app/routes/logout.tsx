import { ActionFunction, redirect } from '@remix-run/cloudflare';
import { accessTokenCookie } from '~/cookies.server';

export const action = (async () => {
  return redirect('/', {
    headers: {
      'Set-Cookie': await accessTokenCookie.serialize('deleted', { maxAge: 0 }),
    },
  });
}) satisfies ActionFunction;
