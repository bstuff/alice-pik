import { ActionFunction, json, redirect } from '@remix-run/cloudflare';
import { useEffect } from 'react';
import { YA_OAUTH_CLIENT_ID } from '~/config';
import { YA_OAUTH_CLIENT_SECRET } from '~/config.server';
import { accessTokenCookie } from '~/cookies.server';
import { generateAuthToken, validateJwtAuthToken } from '~/utils/auth';
import { getQueryParams } from '~/utils/queryString';

export const loader = (async ({ request }) => {
  const params = getQueryParams<{ code?: string; redirect?: string }>(request.url);

  if (params.code) {
    const apiReq0 = new Request(`https://oauth.yandex.ru/token`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${YA_OAUTH_CLIENT_ID}:${YA_OAUTH_CLIENT_SECRET}`)}`,
      },
      body: `grant_type=authorization_code&code=${params.code}`,
    });
    const res0 = (await (await fetch(apiReq0)).json()) as Any;

    const apiReq = new Request('https://login.yandex.ru/info?format=jwt', {
      headers: { authorization: `OAuth ${res0.access_token}` },
    });

    const apiRes = await fetch(apiReq);
    const jwtString = await apiRes.text();

    const [user, err] = await validateJwtAuthToken(jwtString, YA_OAUTH_CLIENT_SECRET);
    if (err || !user) {
      throw err;
    }

    return redirect(params.redirect ?? '/', {
      headers: {
        'Set-Cookie': await accessTokenCookie.serialize(await generateAuthToken(user)),
      },
    });
  }

  return json(null);
}) satisfies ActionFunction;

export default function LoginPage() {
  useEffect(() => {
    (window as Any).YaSendSuggestToken(window.location.origin, {
      flag: true,
    });
  }, []);
  return (
    <>
      <script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-latest.js" />

      <div>OAUTH.ya.token</div>
    </>
  );
}
