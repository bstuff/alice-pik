import { useSuspenseQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { pikStoredRelaysQuery } from '~/pik-intercom/components/PikIntercoms/pikIntercomsQuery';
import imgQr from './_assets/qrcode.svg';
import { twMerge } from 'tailwind-merge';

export const EmptyDevicesOauthBlock: FC = () => {
  const storedRelays = useSuspenseQuery(pikStoredRelaysQuery()).data;
  const devices = storedRelays.storedRelays;
  const hasDevices = devices.length > 0;

  return (
    <div
      role="alert"
      className={twMerge(
        'alert w-full',
        hasDevices && 'alert-success bg-primary/75',
        !hasDevices && 'alert-warning bg-warning/75',
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        {!hasDevices && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        )}
      </svg>
      {hasDevices && (
        <div className="relative flex w-full min-w-0 flex-1 flex-col gap-2">
          <div className="min-h-4 w-full min-w-0 overflow-scroll">
            <div className="flex w-full gap-4">
              {devices.map((it) => (
                <div key={it.id} className="card w-48 min-w-48 bg-base-content shadow">
                  <div className="card-body">
                    <h2 className="card-title">{it.name}</h2>
                    <p>{it.property_geo_units[0]?.post_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <span className="w-full">
            Если вам понадобится изменить список устройств, откройте приложение в браузере (ссылка в
            qr, если вы с мобильного телефона). После добавления устройств можно вернуться в Умный
            Дом и нажать кнопку "<b>обновить список устройств</b>".
          </span> */}
        </div>
      )}
      {!hasDevices && (
        <span>
          У вас пока не добавлено ни одного устройства. Чтобы устройства появились в Алисе, нужно
          добавить их в своём профиле. Для этого откройте приложение в браузере (ссылка в qr, если
          вы с мобильного телефона). После добавления устройств можно вернуться в Умный Дом и нажать
          кнопку "<b>обновить список устройств</b>".
        </span>
      )}
      <img className="hidden" src={imgQr} alt="" width={128} height={128} />
    </div>
  );
};
