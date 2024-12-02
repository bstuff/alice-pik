import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  TypedResponse,
} from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { URL } from 'url';
import { ContentContainer } from '~/components/ContentContainer';
import { EmptyDevicesOauthBlock } from '~/components/EmptyDevicesOauthBlock';
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

export const loader = (async ({
  request,
  context,
}): Promise<
  TypedResponse<{
    //
  }>
> => {
  const params = getQueryParams<RequestParams>(request.url);
  const user = await getUser({ request, context });
  if (!user) {
    const nextUrl = new URL(request.url);

    throw redirect(
      routes.login.ya(null, {
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

  return json({});
}) satisfies LoaderFunction;

export const action = (async ({ request, context }): Promise<TypedResponse<null>> => {
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
