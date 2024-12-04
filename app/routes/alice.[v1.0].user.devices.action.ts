import { ActionFunction, json, TypedResponse } from '@remix-run/cloudflare';
import { firstValueFrom, from, map, mergeMap, toArray } from 'rxjs';
import invariant from 'tiny-invariant';
import { CapabilityType, DeviceActionResponse, OnOffInstance, StateChangeRequest } from '~/alice';
import { NotFoundPikDevice } from '~/pik-intercom/devices/NotFoundPikDevice';
import { PikDeviceCustomData, PikRelayDevice } from '~/pik-intercom/devices/PikRelayDevice';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';
import { getPikToken } from '~/pik-intercom/utils/getPikToken';
import { getUser } from '~/utils/auth';
import { filterBoolean } from '~/utils/boolean';

export const action = (async ({
  request,
  context,
}): Promise<TypedResponse<DeviceActionResponse>> => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  const pikToken = await getPikToken({ request, context });
  invariant(pikToken);

  const reqJson = (await request.json()) as StateChangeRequest;
  // >>> {"payload":{"devices":[{"id":"pik:relay:40625","capabilities":[{"type":"devices.capabilities.on_off","state":{"instance":"on","value":true}}],"custom_data":{"_provider":"pik","type":"relay"}}]}}
  // console.log('>>>', JSON.stringify(reqJson));

  const requestedDevices = reqJson.payload.devices
    .map((it) => {
      if ((it.custom_data as PikDeviceCustomData)?._provider === 'pik') {
        return {
          id: +it.id.replace(/.*:/, ''),
          capabilitiesRequest: it.capabilities ?? [],
        };
      }
      return null;
    })
    .filter(filterBoolean);
  const requestedIds = requestedDevices.map((it) => it.id);
  const knownRelays = await fetchStoredRelays({ request, context });

  const r$ = from(requestedIds).pipe(
    map((id) => {
      const knownRelay = knownRelays.find((it) => it.id === id);
      if (knownRelay) {
        const door = PikRelayDevice.fromPikRelay(knownRelay);
        door.authHeader = pikToken;

        return door;
      }

      return NotFoundPikDevice.fromId(id);
    }),
    mergeMap((door) => {
      const r = Promise.resolve().then(() =>
        door.performChanges([
          {
            type: CapabilityType.OnOff,
            state: {
              instance: OnOffInstance.on,
              value: true,
            },
          },
        ]),
      );

      return from(r);
    }),
    toArray(),
  );

  const res: DeviceActionResponse = {
    request_id: request.headers.get('x-request-id') || '',
    payload: {
      devices: await firstValueFrom(r$),
    },
  };

  return json(res);
}) satisfies ActionFunction;
