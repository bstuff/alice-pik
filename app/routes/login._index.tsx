import { ActionFunction, json } from '@remix-run/cloudflare';
import { useEffect, useId, useRef, useState } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { YA_OAUTH_CLIENT_ID } from '~/config';
import { loadScript } from '~/utils/loadScript';
import { routes } from '~/utils/routes';

export const action = (() => {
  return json(null);
}) satisfies ActionFunction;

export default function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const [innerHtml, setInnerHtml] = useState('');

  useEffect(() => {
    loadScript({
      src: 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-latest.js',
      async onLoad() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!formRef.current) {
          return;
        }

        try {
          const result = await (window as Any).YaAuthSuggest.init(
            {
              client_id: YA_OAUTH_CLIENT_ID,
              response_type: 'token',
              redirect_uri: `${window.location.origin}/oauth/ya/token`,
            },
            window.location.origin,
            {
              view: 'button',
              parentId: id,
              buttonView: 'main',
              buttonTheme: 'light',
              buttonSize: 'm',
              buttonBorderRadius: 0,
            },
          );
          const data: {
            access_token: string;
            token_type: 'bearer';
            // numeric
            expires_in: string;
            // user id
            cid: string;
            extraData: { flag: true };
          } = await result.handler();

          const form = formRef.current!;
          form.querySelector<HTMLInputElement>('[name=access_token]')!.value = data.access_token;
          form.querySelector<HTMLInputElement>('[name=token_type]')!.value = data.token_type;
          form.querySelector<HTMLInputElement>('[name=expires_in]')!.value = data.expires_in;
          form.querySelector<HTMLInputElement>('[name=redirect]')!.value =
            new URL(window.location.href).searchParams.get('redirect') ?? '/';

          console.log('Сообщение с токеном: ', data);
          setInnerHtml(`Сообщение с токеном: ${JSON.stringify(data)}`);

          // form.submit();
          form.querySelector<HTMLButtonElement>('button')!.click();
        } catch (error) {
          console.error('Что-то пошло не так: ', error);
          setInnerHtml(`Что-то пошло не так: ${JSON.stringify(error)}`);
        }
      },
      onError() {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Login</h1>
      <div className="mx-auto mt-8 hidden w-full max-w-[600px] flex-col">
        <form className="flex w-full flex-col gap-4 rounded bg-base-200 p-8">
          <label className="input input-bordered flex items-center gap-2">
            Username
            <input
              className="grow"
              type="text"
              name="login"
              placeholder="email@yandex.com"
              autoComplete="username"
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Password
            <input
              className="grow"
              type="password"
              name="password"
              placeholder="Daisy"
              autoComplete="password"
              required
            />
          </label>
          <button className="align-self-end btn btn-primary btn-md" type="submit">
            Login
          </button>
        </form>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[600px]">
        <div id={id} className="mt-8" />

        <form
          className="hidden flex-col gap-2 bg-slate-50"
          method="POST"
          action={routes.login.ya.token()}
          ref={formRef}
        >
          <input name="access_token" defaultValue="" />
          <input name="token_type" defaultValue="bearer" />
          <input name="expires_in" defaultValue="" />
          <input name="redirect" defaultValue="" />
          <button>go</button>
        </form>

        <pre className="mt-4 w-full">{innerHtml}</pre>
      </div>
    </ContentContainer>
  );
}
