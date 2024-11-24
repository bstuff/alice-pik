import { json, LoaderFunction, redirect, TypedResponse } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { URL } from 'url';
import { getUser } from '~/utils/auth';
import { sha256 } from '~/utils/crypto';
import { oauthCodeKvKey } from '~/utils/oauth';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';

type RequestParams = {
  state: string;
  redirect_uri: string;
  response_type: 'code';
  client_id: string;
};

export const loader = (async ({ request, context }): Promise<TypedResponse<void>> => {
  const params = getQueryParams<RequestParams>(request.url);
  const user = await getUser({ request, context });
  if (!user) {
    const nextUrl = new URL(request.url)

    throw redirect(
      routes.login(null, {
        redirect: `${nextUrl.pathname}${nextUrl.search}`,
      }),
    );
  }
  invariant(user);

  if (params.response_type !== 'code') {
    throw json(
      {
        error: 'invalid_response',
        error_description: 'The response_type must be "code".',
      },
      400,
    );
  }

  const code = await sha256(`${performance.now()}${user.uid}`);

  const dataToStore = JSON.stringify({
    user,
    clientId: params.client_id,
  });

  await context.env.USERS.put(oauthCodeKvKey(code), dataToStore, {
    expirationTtl: 60 * 5,
  });

  const nextUrl = new URL(params.redirect_uri);
  nextUrl.searchParams.set('state', params.state);
  nextUrl.searchParams.set('code', code);

  return redirect(nextUrl.toString());
}) satisfies LoaderFunction;
