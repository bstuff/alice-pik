import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  TypedResponse,
} from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import _debug from 'debug';
import { Suspense } from 'react';
import invariant from 'tiny-invariant';
import { URL } from 'url';
import { ContentContainer } from '~/components/ContentContainer';
import { EmptyDevicesOauthBlock } from '~/components/EmptyDevicesOauthBlock';
import { checkPikToken } from '~/pik-intercom/utils/checkPikToken';
import { getPikToken } from '~/pik-intercom/utils/getPikToken';
import { getUser } from '~/utils/auth';
import { ClientOnly } from '~/utils/ClientOnly';
import { sha256 } from '~/utils/crypto';
import { oauthCodeKvKey } from '~/utils/oauth';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';
import { StepsText } from '~/utils/stepsText';

const debug = _debug('app:routes:ya:authorize');

type RequestParams = {
  state: string;
  redirect_uri: string;
  response_type: 'code';
  client_id: string;
};

export const loader = (async ({ request, context }) => {
  debug('loader', request.url);
  const params = getQueryParams<RequestParams>(request.url);
  const yaredirect = `${new URL(request.url).pathname}${new URL(request.url).search}`;
  const user = await getUser({ request, context });
  if (!user) {
    debug('No user. Redirecting to login.');

    throw redirect(
      routes.ya.login(null, {
        yaredirect: yaredirect,
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

    throw redirect(
      routes.ya.pik(null, {
        yaredirect: yaredirect,
      }),
    );
  }

  const validatedPikToken = await checkPikToken(pikToken);

  if (!validatedPikToken) {
    debug('No pik token. Redirecting.');

    throw redirect(
      routes.ya.pik(null, {
        yaredirect: yaredirect,
      }),
    );
  }

  return json({
    yaredirect,
  });
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
  const loaderData = useLoaderData<typeof loader>();

  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Авторизация</h1>
      <div className="mx-auto mt-6 w-full max-w-[600px]">
        <ul className="steps steps-vertical">
          <li data-content="✅" className="step step-primary">
            <Link
              to={routes.ya.login(null, {
                yaredirect: loaderData.yaredirect,
              })}
            >
              {StepsText.STEP1}
            </Link>
          </li>
          <li data-content="✅" className="step step-primary">
            <Link
              to={routes.ya.pik(null, {
                yaredirect: loaderData.yaredirect,
              })}
            >
              {StepsText.STEP2}
            </Link>
          </li>
          <li data-content="✅" className="step step-primary">
            <Link
              to={routes.ya.devices(null, {
                yaredirect: loaderData.yaredirect,
              })}
            >
              {StepsText.STEP3}
            </Link>
          </li>
          <li className="step step-primary">{StepsText.STEP4}</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        Разрешить приложению "Умный дом с Алисой" управлять вашими устройствами?
      </div>

      <div className="text-center">Приложение получит доступ к следующим устройствам:</div>

      <div className="mt-6">
        <ClientOnly>
          <Suspense fallback={null}>
            <EmptyDevicesOauthBlock />
          </Suspense>
        </ClientOnly>
      </div>

      {/* или */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          className="btn btn-error btn-md"
          onClick={() => {
            fetch(routes.logout(), { method: 'POST' }).then(() => window.close());
          }}
        >
          Запретить
        </button>
        <form action="" method="POST">
          <button className="btn btn-success btn-md" type="submit">
            Разрешить
          </button>
        </form>
      </div>

      <div className="h-6" />
    </ContentContainer>
  );
}
