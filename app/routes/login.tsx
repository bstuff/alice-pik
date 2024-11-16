import { useEffect, useId, useRef, useState } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { YA_OAUTH_CLIENT_ID } from '~/config';
import { loadScript } from '~/utils/loadScript';

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
      <div className="text-center text-2xl">Login</div>
      <div id={id} className="mt-8 w-full max-w-[600px]" />

      <form
        className="hidden flex-col gap-2 bg-slate-50"
        method="POST"
        action="/login/ya/token"
        ref={formRef}
      >
        <input name="access_token" defaultValue="" />
        <input name="token_type" defaultValue="bearer" />
        <input name="expires_in" defaultValue="" />
        <button>go</button>
      </form>

      <pre className="mt-4 w-full max-w-[600px]">{innerHtml}</pre>
    </ContentContainer>
  );
}
