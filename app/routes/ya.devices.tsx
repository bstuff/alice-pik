import { json, LoaderFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import _debug from 'debug';
import { Suspense } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { PikIntercoms } from '~/pik-intercom/components/PikIntercoms/PikIntercoms';
import { ClientOnly } from '~/utils/ClientOnly';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';
import { StepsText } from '~/utils/stepsText';

const debug = _debug('app:routes:ya:devices');

export const loader = (async ({ request }) => {
  const params = getQueryParams<{ yaredirect?: string }>(request.url);
  debug('loader', request.url);

  return json({ yaredirect: params.yaredirect });
}) satisfies LoaderFunction;

export default function YaPikPage() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Шаг 2</h1>

      <div className="mx-auto mt-8 w-full max-w-[600px]">
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
          <li className="step step-primary">{StepsText.STEP3}</li>
          <li className="step">{StepsText.STEP4}</li>
        </ul>
      </div>

      <div className="mx-auto mt-8">
        <ClientOnly>
          <Suspense fallback={<div className="loading" />}>
            <PikIntercoms />
          </Suspense>
        </ClientOnly>
      </div>

      <div className="h-6" />
    </ContentContainer>
  );
}
