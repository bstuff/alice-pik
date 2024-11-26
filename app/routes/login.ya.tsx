import { ActionFunction, json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { useMemo } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { YA_OAUTH_CLIENT_ID } from '~/config';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';

export const loader = (async ({ request }) => {
  const params = getQueryParams<{ code?: string; redirect?: string }>(request.url);
  return json({
    origin: new URL(request.url).origin.replace(/^http:/, 'https:'),
    redirect: params.redirect,
  });
}) satisfies ActionFunction;

export default function LoginYaPage() {
  const loaderData = useLoaderData<typeof loader>();
  const yaLink = useMemo(() => {
    const url = new URL('https://oauth.yandex.ru/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', YA_OAUTH_CLIENT_ID);
    url.searchParams.set('force_confirm', 'yes');
    url.searchParams.set(
      'redirect_uri',
      `${loaderData.origin}${routes.oauth.ya.token(null, { redirect: loaderData.redirect })}`,
    );

    return url.toString();
  }, [loaderData.origin, loaderData.redirect]);

  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Login</h1>

      <div className="mx-auto mt-8 w-full max-w-[600px]">
        <Link className="btn btn-accent" to={yaLink}>
          Войти
        </Link>
      </div>
    </ContentContainer>
  );
}
