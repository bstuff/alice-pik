import { decode } from '@tsndr/cloudflare-worker-jwt';
import { COMMON_PIK_HEADERS } from './commonHeaders';
import invariant from 'tiny-invariant';

export async function newPikToken(login: string, password: string) {
  try {
    const apiFormData = new FormData();
    apiFormData.append('account[phone]', login);
    apiFormData.append('account[password]', password);
    // apiFormData.append('customer_device[uid]', '1234568-BD43-1234-1234-72A205CD2D9F');

    const apiReq = new Request('https://intercom.rubetek.com/api/customers/sign_in', {
      method: 'POST',
      headers: {
        ...COMMON_PIK_HEADERS,
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        accept: '*/*',
        'accept-language': 'ru',
      },
      body: new URLSearchParams(apiFormData as Any),
    });

    const apiRes = await fetch(apiReq);
    // const js = await res.json();
    const apiResHeaders = apiRes.headers;
    const authHeader = apiResHeaders.get('authorization');
    invariant(authHeader, 'authHeader');
    const decodedToken = decode(authHeader.replace('Bearer ', ''));
    invariant(typeof decodedToken.payload?.exp === 'number');

    return { authHeader, payload: decodedToken.payload };
  } catch (error) {
    return null;
  }
}
