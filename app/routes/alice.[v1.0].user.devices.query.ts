import { ActionFunction, json, TypedResponse } from '@remix-run/cloudflare';
import { firstValueFrom, from, map, mergeMap, toArray } from 'rxjs';
import { DeviceStateRequest, DeviceStateResponse } from '~/alice';
import { NotFoundPikDevice } from '~/pik-intercom/devices/NotFoundPikDevice';
import { PikDeviceCustomData, PikRelayDevice } from '~/pik-intercom/devices/PikRelayDevice';
import { checkPikToken } from '~/pik-intercom/utils/checkPikToken';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';
import { getPikToken } from '~/pik-intercom/utils/getPikToken';
import { getUser } from '~/utils/auth';

export const action = (async ({
  request,
  context,
}): Promise<TypedResponse<DeviceStateResponse>> => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }
  context.posthog.capture({ event: 'Devices/Query', distinctId: `ya:${user.uid}` });
  const pikToken = await getPikToken({ request, context });
  // invariant(pikToken);
  const isPikTokenValid = pikToken && (await checkPikToken(pikToken));

  // >>> {"devices":[{"id":"pik:relay:11111","custom_data":{"type":"relay"}}]}
  // console.log('>>>', JSON.stringify(reqJson));
  const reqJson = (await request.json()) as DeviceStateRequest;

  const requestedIds = reqJson.devices
    .map((it) => {
      if ((it.custom_data as PikDeviceCustomData)?._provider === 'pik') {
        return +it.id.replace(/.*:/, '');
      }
      return null;
    })
    .filter((it): it is number => !!it);
  const knownRelays = await fetchStoredRelays({ request, context });

  const r$ = from(requestedIds).pipe(
    map((id) => {
      const knownRelay = knownRelays.find((it) => it.id === id);
      if (!knownRelay) {
        return NotFoundPikDevice.fromId(id);
      }

      const door = PikRelayDevice.fromPikRelay(knownRelay);
      if (isPikTokenValid) {
        door.authHeader = pikToken ?? 'Bearer unknown';
      }

      return door;
    }),
    mergeMap((door) => {
      const r = Promise.resolve().then(() => door.getState());

      return from(r);
    }),
    toArray(),
  );

  const res: DeviceStateResponse = {
    request_id: request.headers.get('x-request-id') || '',
    payload: {
      devices: await firstValueFrom(r$),
    },
  };

  return json(res);
}) satisfies ActionFunction;
