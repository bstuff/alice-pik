import { json, LoaderFunction } from '@remix-run/cloudflare';
import _debug from 'debug';
import { Suspense } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { PikIntercoms } from '~/pik-intercom/components/PikIntercoms/PikIntercoms';
import { ClientOnly } from '~/utils/ClientOnly';
import { StepsText } from '~/utils/stepsText';

const debug = _debug('app:routes:ya:devices');

export const loader = (async ({ request }) => {
  // const params = getQueryParams<{ code?: string; redirect?: string }>(request.url);
  debug('loader', request.url);
  return json(null);
}) satisfies LoaderFunction;

export default function YaPikPage() {
  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Шаг 2</h1>

      <div className="mx-auto mt-8 w-full max-w-[600px]">
        <ul className="steps steps-vertical">
          <li data-content="✅" className="step step-primary">
            {StepsText.STEP1}
          </li>
          <li data-content="✅" className="step step-primary">
            {StepsText.STEP2}
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
    </ContentContainer>
  );
}
