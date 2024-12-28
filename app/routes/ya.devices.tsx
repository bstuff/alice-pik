import { json, LoaderFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import _debug from 'debug';
import { FC, Suspense } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { PikIntercoms } from '~/pik-intercom/components/PikIntercoms/PikIntercoms';
import { pikStoredRelaysQuery } from '~/pik-intercom/components/PikIntercoms/pikIntercomsQuery';
import { getUser } from '~/utils/auth';
import { ClientOnly } from '~/utils/ClientOnly';
import { getQueryParams } from '~/utils/queryString';
import { routes } from '~/utils/routes';
import { StepsText } from '~/utils/stepsText';

const debug = _debug('app:routes:ya:devices');

export const loader = (async ({ request, context }) => {
  const params = getQueryParams<{ yaredirect?: string }>(request.url);
  debug('loader', request.url);

  const user = await getUser({ request, context });
  context.posthog.capture({
    event: '$pageview',
    distinctId: `ya:${user?.uid}`,
    properties: {
      $current_url: '/ya/devices'
    }
  });

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

      <div className="relative mx-auto mt-8">
        <ClientOnly>
          <div className="my-4">Добавьте хотя бы 1 устройство:</div>
          <Suspense fallback={<div className="loading" />}>
            <PikIntercoms />
          </Suspense>
        </ClientOnly>

        <div className="sticky bottom-0 col-span-full flex h-0 w-full justify-end pb-5">
          <Suspense fallback={<div className="loading" />}>
            <ButtonNext yaredirect={loaderData.yaredirect} />
          </Suspense>
        </div>
      </div>

      <div className="h-6" />
    </ContentContainer>
  );
}

const ButtonNext: FC<{ yaredirect?: string }> = ({ yaredirect }) => {
  const storedRelays = useSuspenseQuery(pikStoredRelaysQuery()).data;

  if (!yaredirect || storedRelays.storedRelays.length === 0) {
    return null;
  }
  return (
    <div className="">
      <div className="-translate-y-full">
        <Link className="btn btn-primary btn-md" to={yaredirect}>
          Далее
        </Link>
      </div>
    </div>
  );
};
