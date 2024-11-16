import { json, LoaderFunction, TypedResponse } from '@remix-run/cloudflare';
import { type DeviceListResponse } from '~/alice';
import { PikRelayDevice } from '~/pik-intercom/devices/PikRelayDevice';
import { fetchStoredRelays } from '~/pik-intercom/utils/fetchStoredRelays';
import { getUser } from '~/utils/auth';

export const loader = (async ({ request, context }): Promise<TypedResponse<DeviceListResponse>> => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  const relays = await fetchStoredRelays({ request, context });

  const doors = relays.map((it) => PikRelayDevice.fromPikRelay(it));

  const res: DeviceListResponse = {
    request_id: request.headers.get('x-request-id') || '',
    payload: {
      user_id: `${user.uid}`,
      devices: [
        //
        ...doors.map((it) => it.toJson()),
      ],
    },
  };

  return json(res);
}) satisfies LoaderFunction;
