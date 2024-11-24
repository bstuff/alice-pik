import { ActionFunction, redirect } from '@remix-run/cloudflare';
import { YA_OAUTH_CLIENT_SECRET } from '~/config.server';
import { accessTokenCookie } from '~/cookies.server';
import { generateAuthToken, validateJwtAuthToken } from '~/utils/auth';

export const action = (async ({ request }) => {
  const formData = await request.formData();

  const apiReq = new Request('https://login.yandex.ru/info?format=jwt', {
    headers: { authorization: `OAuth ${formData.get('access_token')}` },
  });

  const apiRes = await fetch(apiReq);
  const jwtString = await apiRes.text();

  const [user, err] = await validateJwtAuthToken(jwtString, YA_OAUTH_CLIENT_SECRET);
  if (err || !user) {
    throw err;
  }

  return redirect('/', {
    headers: {
      'Set-Cookie': await accessTokenCookie.serialize(await generateAuthToken(user)),
    },
  });
}) satisfies ActionFunction;
