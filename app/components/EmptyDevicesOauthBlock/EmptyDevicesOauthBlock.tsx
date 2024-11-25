import { FC } from 'react';
import imgQr from './_assets/qrcode.svg';

export const EmptyDevicesOauthBlock: FC = () => {
  return (
    <div role="alert" className="alert alert-warning w-full bg-warning/75">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>
        У вас пока не добавлено ни одного устройства. Чтобы устройства появились в Алисе, нужно
        добавить их в своём профиле. Для этого откройте приложение в браузере (ссылка в qr, если вы
        с мобильного телефона). После добавления устройств можно вернуться в Умный Дом и нажать
        кнопку "обновить список устройств".
      </span>
      <img src={imgQr} alt="" width={128} height={128} />
    </div>
  );
};
