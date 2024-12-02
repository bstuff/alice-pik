import { decode } from '@tsndr/cloudflare-worker-jwt';
import invariant from 'tiny-invariant';
import { COMMON_PIK_HEADERS } from './commonHeaders';
import { PikPagination } from './types';

export async function checkPikToken(authHeader: string) {
  try {
    invariant(authHeader, 'authHeader');
    const decodedToken = decode(authHeader.replace('Bearer ', ''));
    invariant(typeof decodedToken.payload?.exp === 'number');

    const headReq = new Request(`https://iot.rubetek.com/api/alfred/v1/personal/intercoms`, {
      method: 'HEAD',
      headers: {
        accept: 'application/json',
        authorization: authHeader,
        ...COMMON_PIK_HEADERS,
      },
    });
    const r1 = await fetch(headReq);
    const r2 = JSON.parse(r1.headers.get('x-pagination') ?? 'null') as Nullable<PikPagination>
    invariant(typeof r2?.count === 'number');

    return { authHeader, payload: decodedToken.payload };
  } catch (error) {
    return null;
  }
}
