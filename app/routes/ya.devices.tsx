import { json, LoaderFunction } from '@remix-run/cloudflare';
import _debug from 'debug';
import { ContentContainer } from '~/components/ContentContainer';
import { PikIntercoms } from '~/pik-intercom/components/PikIntercoms/PikIntercoms';
import { ClientOnly } from '~/utils/ClientOnly';

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
            Шаг 1: Войти при помощи Яндекс-аккаунта
          </li>
          <li data-content="✅" className="step step-primary">
            Шаг 2: Получение токена для управления устройствами
          </li>
          <li className="step step-primary">Шаг 3: Выбор устройств, доступных в умном доме</li>
          <li className="step">Шаг 4: Привязка аккаунта к умному дому</li>
        </ul>
      </div>

      <div className="mx-auto mt-8">
        <ClientOnly>
          <PikIntercoms />
        </ClientOnly>
      </div>
    </ContentContainer>
  );
}
