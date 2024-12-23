import { json, LoaderFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import _debug from 'debug';
import { useMemo } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { YA_OAUTH_CLIENT_ID } from '~/config';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';
import { StepsText } from '~/utils/stepsText';

const debug = _debug('app:routes:ya:login');

export const loader = (async ({ request }) => {
  const params = getQueryParams<{ code?: string; yaredirect?: string }>(request.url);
  debug('loader', params, request.url);
  return json({
    yaredirect: params.yaredirect,
  });
}) satisfies LoaderFunction;

export default function LoginYaPage() {
  const loaderData = useLoaderData<typeof loader>();
  const yaLink = useMemo(() => {
    const url = new URL('https://oauth.yandex.ru/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', YA_OAUTH_CLIENT_ID);
    url.searchParams.set('force_confirm', 'yes');
    url.searchParams.set(
      'redirect_uri',
      `${window.location.origin}${routes.oauth.ya.token(null, {
        redirect: routes.ya.pik(null, {
          yaredirect: loaderData.yaredirect,
        }),
      })}`,
    );

    return url.toString();
  }, [loaderData.yaredirect]);

  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Login</h1>

      <div className="mx-auto mt-8 w-full max-w-[600px]">
        <ul className="steps steps-vertical">
          <li className="step step-primary">{StepsText.STEP1}</li>
          <li className="step">{StepsText.STEP2}</li>
          <li className="step">{StepsText.STEP3}</li>
          <li className="step">{StepsText.STEP4}</li>
        </ul>
      </div>
      <div className="mx-auto mt-8 w-full max-w-[600px]">
        <Link className="btn btn-accent" to={yaLink}>
          Войти
        </Link>
      </div>
    </ContentContainer>
  );
}
