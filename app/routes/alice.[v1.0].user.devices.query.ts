import { ActionFunction, json, TypedResponse } from '@remix-run/cloudflare';
import { DeviceStateRequest, DeviceStateResponse } from '~/alice';
import { PikDeviceCustomData, PikRelayDevice } from '~/pik-intercom/devices/PikRelayDevice';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';
import { getUser } from '~/utils/auth';

export const action = (async ({
  request,
  context,
}): Promise<TypedResponse<DeviceStateResponse>> => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

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

  const relays = (await fetchStoredRelays({ request, context })).filter((it) =>
    requestedIds.includes(it.id),
  );

  const doors = relays.map((it) => PikRelayDevice.fromPikRelay(it));

  const res: DeviceStateResponse = {
    request_id: request.headers.get('x-request-id') || '',
    payload: {
      devices: [...doors.map((it) => it.getState())],
    },
  };

  return json(res);
}) satisfies ActionFunction;
