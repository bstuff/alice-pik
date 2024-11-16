import { ActionFunction, json, redirect } from '@remix-run/cloudflare';
import { decode } from '@tsndr/cloudflare-worker-jwt';
import invariant from 'tiny-invariant';
import { getTokenKvKey } from '~/pik-intercom/utils/kvKeys';
import { getUser } from '~/utils/auth';
import { routes } from '~/utils/routes';

export const action = (async ({ request, context }) => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  const requestData = await request.formData();
  const apiFormData = new FormData();
  apiFormData.append('account[password]', requestData.get('password')!);
  apiFormData.append('account[phone]', requestData.get('login')!);
  // apiFormData.append('customer_device[uid]', '1234568-BD43-1234-1234-72A205CD2D9F');

  const apiReq = new Request('https://intercom.rubetek.com/api/customers/sign_in', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'user-agent': 'domophone-ios/530538 CFNetwork/1410.0.3 Darwin/22.6.0',
      'api-version': '2',
      accept: '*/*',
      'accept-language': 'ru',
    },
    body: new URLSearchParams(apiFormData as Any),
  });

  const apiRes = await fetch(apiReq);
  // const js = await res.json();
  const apiResHeaders = apiRes.headers;
  const authHeader = apiResHeaders.get('authorization');
  const ttt = decode(authHeader!.replace('Bearer ', ''));
  invariant(typeof ttt.payload?.exp === 'number');

  await context.env.USERS.put(getTokenKvKey(user.uid), authHeader!, {
    expiration: ttt.payload?.exp,
  });

  return redirect(routes.services.pik());
  return json({ authHeader });
}) satisfies ActionFunction;
