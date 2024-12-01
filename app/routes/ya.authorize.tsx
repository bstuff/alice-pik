import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  TypedResponse,
} from '@remix-run/cloudflare';
import _debug from 'debug';
import invariant from 'tiny-invariant';
import { URL } from 'url';
import { ContentContainer } from '~/components/ContentContainer';
import { EmptyDevicesOauthBlock } from '~/components/EmptyDevicesOauthBlock';
import { getPikToken } from '~/pik-intercom/utils/getPikToken';
import { getUser } from '~/utils/auth';
import { sha256 } from '~/utils/crypto';
import { oauthCodeKvKey } from '~/utils/oauth';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';

const debug = _debug('app:routes:ya:authorize');

type RequestParams = {
  state: string;
  redirect_uri: string;
  response_type: 'code';
  client_id: string;
};

export const loader = (async ({
  request,
  context,
}): Promise<
  TypedResponse<{
    //
  }>
> => {
  debug('loader', request.url);
  const params = getQueryParams<RequestParams>(request.url);
  const user = await getUser({ request, context });
  if (!user) {
    debug('No user. Redirecting to login.');
    const nextUrl = new URL(request.url);

    throw redirect(
      routes.ya.login(null, {
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

  const pikToken = await getPikToken({ request, context });

  if (!pikToken) {
    debug('No pik token. Redirecting.');
    const nextUrl = new URL(request.url);

    throw redirect(
      routes.ya.pik(null, {
        redirect: `${nextUrl.pathname}${nextUrl.search}`,
      }),
    );
  }

  return json({});
}) satisfies LoaderFunction;

export const action = (async ({ request, context }): Promise<TypedResponse<null>> => {
  debug('action', request.url);
  const params = getQueryParams<RequestParams>(request.url);
  const user = await getUser({ request, context });
  invariant(user);

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
}) satisfies ActionFunction;

export default function AuthorizePage() {
  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Авторизация</h1>
      <div className="text-center">
        Разрешить приложению "Умный дом с Алисой" управлять вашими устройствами?
      </div>

      <div className="text-center">Приложение получит доступ к следующим устройствам:</div>
      <div>
        <EmptyDevicesOauthBlock />
      </div>

      {/* или */}
      <div className="flex items-center justify-center gap-2">
        <button
          className="btn btn-error btn-sm"
          onClick={() => {
            fetch(routes.logout(), { method: 'POST' }).then(() => window.close());
          }}
        >
          Запретить
        </button>
        <form action="" method="POST">
          <button className="btn btn-success btn-sm" type="submit">
            Разрешить
          </button>
        </form>
      </div>
    </ContentContainer>
  );
}
