import { ActionFunction, json } from '@remix-run/cloudflare';
import invariant from 'tiny-invariant';
import { getPikToken } from '~/pik-intercom/utils/getPikToken';
import { unlockRelay } from '~/pik-intercom/utils/unlockRelay';

export type UnlockRelayRequestParams = {
  relayId: number;
};

export const action = (async ({ request, context }) => {
  const { relayId } = await request.json<UnlockRelayRequestParams>();
  const pikToken = await getPikToken({ request, context });
  invariant(pikToken && relayId);

  return json(await unlockRelay(pikToken, relayId));
}) satisfies ActionFunction;
