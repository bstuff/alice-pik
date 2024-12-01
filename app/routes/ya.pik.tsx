import { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/react';
import _debug from 'debug';
import { ContentContainer } from '~/components/ContentContainer';

const debug = _debug('app:routes:ya:pik');

// export { PikAddUserPage as default } from '~/pik-intercom/components/PikAddUser/PageAddUser';
// export { action } from '~/pik-intercom/components/PikAddUser/PageAddUser.action';
// export { loader } from '~/pik-intercom/components/PikAddUser/PageAddUser.loader';

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
          <li className="step step-primary">Шаг 2: Получение токена для управления устройствами</li>
          <li className="step">Шаг 3: Выбор устройств, доступных в умном доме</li>
          <li className="step">Шаг 4: Привязка аккаунта к умному дому</li>
        </ul>
      </div>
    </ContentContainer>
  );
}
