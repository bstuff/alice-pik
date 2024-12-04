import invariant from 'tiny-invariant';
import { COMMON_PIK_HEADERS } from './commonHeaders';

export async function unlockRelay(pikToken: string, relayId: number) {
  const headReq = new Request(
    `https://iot.rubetek.com/api/alfred/v1/personal/relays/${relayId}/unlock`,
    {
      method: 'POST',
      headers: {
        accept: '*/*',
        authorization: pikToken,
        ...COMMON_PIK_HEADERS,
      },
    },
  );
  const res = await fetch(headReq);

  const resJson = await res.json();

  invariant(resJson && typeof resJson === 'object');

  if ('error' in resJson) {
    throw new Error(resJson.error as string);
  }

  return resJson;
}
