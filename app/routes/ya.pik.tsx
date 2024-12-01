import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/cloudflare';
import { useActionData } from '@remix-run/react';
import _debug from 'debug';
import { ContentContainer } from '~/components/ContentContainer';
import { newPikToken } from '~/pik-intercom/utils/newPikToken';
import { storePikToken } from '~/pik-intercom/utils/storePikToken';
import { getUser } from '~/utils/auth';
import { routes } from '~/utils/routes';

const debug = _debug('app:routes:ya:pik');

export const action = (async ({ request, context }) => {
  // const params = getQueryParams<{ code?: string; redirect?: string }>(request.url);
  debug('action', request.url);
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  const requestData = await request.formData();
  const pikToken = await newPikToken(
    requestData.get('login') as string,
    requestData.get('password') as string,
  );

  const error = pikToken ? null : 'Неправильный логин или пароль.';

  if (pikToken) {
    await storePikToken(context, user.uid, pikToken);

    const nextUrl = new URL(request.url);

    throw redirect(
      routes.ya.devices(null, {
        redirect: `${nextUrl.pathname}${nextUrl.search}`,
      }),
    );
  }

  return json({ pikToken, error });
}) satisfies ActionFunction;

export const loader = (async ({ request }) => {
  // const params = getQueryParams<{ code?: string; redirect?: string }>(request.url);
  debug('loader', request.url);
  return json(null);
}) satisfies LoaderFunction;

export default function YaPikPage() {
  const actionData = useActionData<typeof action>();

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

      <div className="mx-auto mt-8 max-w-[600px]">
        <form className="flex w-full flex-col gap-4 rounded bg-base-200 p-8" method="POST">
          <div>Логин и пароль от приложения домофона</div>
          {actionData?.error && (
            <div role="alert" className="alert alert-error">
              <span>{actionData.error}</span>
            </div>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <b>Телефон:</b>
            <input
              className="grow"
              type="text"
              name="login"
              autoComplete="username"
              pattern="^\+7\d{10}$"
              placeholder="+79991112233"
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <b>Пароль:</b>
            <input
              className="grow"
              type="password"
              name="password"
              autoComplete="password"
              required
              minLength={4}
              placeholder="password"
            />
          </label>
          <button className="btn btn-primary btn-md w-full" type="submit">
            Привязать
          </button>
          <div role="alert" className="alert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-info"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Данные не сохраняются на сервере, а нужны для получения токена доступа к приложению
              сроком на год. После истечения токена процедуру привязки нужно повторить.
            </span>
          </div>
        </form>
      </div>
    </ContentContainer>
  );
}
