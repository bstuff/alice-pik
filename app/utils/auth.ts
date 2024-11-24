import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { decode, sign, verify } from '@tsndr/cloudflare-worker-jwt';
import { endWith, filter, firstValueFrom, from, map, merge } from 'rxjs';
import { JWT_REFRESH_TTL, JWT_SECRET, JWT_TTL, YA_OAUTH_CLIENT_SECRET } from '~/config.server';
import { accessTokenCookie } from '~/cookies.server';

export type UserJwtPayload = {
  uid: number;
  display_name: string;
  email: string;
  exp: number;
  gender: string;
  iat: number;
  iss: string;
  jti: string;
  login: string;
  name: string;
  psuid: string;
};

export async function generateAuthToken(user: UserJwtPayload) {
  const token = await sign(
    {
      ...user,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_TTL,
      iss: 'alice-pik.pages.dev',
    },
    JWT_SECRET,
  );

  return token;
}

export async function generateRefreshToken(user: UserJwtPayload) {
  const token = await sign(
    {
      ...user,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_REFRESH_TTL,
      iss: 'alice-pik.pages.dev',
    },
    JWT_SECRET,
  );

  return token;
}

export class ExpiredTokenError extends Error {}
export class WrongTokenError extends Error {}

export async function validateJwtAuthToken(
  token: string,
  secret = JWT_SECRET,
): Promise<[UserJwtPayload, null] | [null, Error]> {
  const now = Math.floor(Date.now() / 1000);

  try {
    const { payload } = decode<UserJwtPayload>(token)!;
    if (now > (payload!.exp ?? 0)) {
      return [null, new ExpiredTokenError()];
    }

    if (typeof payload!.uid !== 'number') {
      return [null, new WrongTokenError()];
    }

    const isValid = await verify(token, secret);
    if (!isValid) {
      return [null, new WrongTokenError()];
    }

    return [payload!, null];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return [null, error];
    }

    return [null, new Error('unknown_error')];
  }
}

export async function getAccessTokenFromAuthHeader(request: Request): Promise<string | null> {
  const authorizationHeaderToken = request.headers.get('Authorization');

  if (!authorizationHeaderToken || !authorizationHeaderToken.startsWith('Bearer ')) {
    return null;
  }

  const accessToken = authorizationHeaderToken.replace(/^bearer\s+/i, '');

  return accessToken;
}

export async function getAccessTokenFromCookie(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get('Cookie');
  const accessToken = await accessTokenCookie.parse(cookieHeader);

  return accessToken ?? null;
}

const KEY_GET_USER = Symbol('getUser');

export async function getUser({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'context' | 'request'>): Promise<UserJwtPayload | null> {
  const r = context as { [KEY_GET_USER]?: ReturnType<typeof getUserImpl> };

  return await (r[KEY_GET_USER] ?? (r[KEY_GET_USER] = getUserImpl(request)));
}

// function isYandexRequest(request: Request) {
//   return request.headers.get('user-agent') === 'Yandex LLC';
// }

async function getUserImpl(request: Request): Promise<UserJwtPayload | null> {
  // if (isYandexRequest(request)) {
  //   const accessToken = await getAccessTokenFromAuthHeader(request);
  //   const apiReq = new Request('https://login.yandex.ru/info?format=jwt', {
  //     headers: { authorization: `OAuth ${accessToken}` },
  //   });
  //   const apiRes = await fetch(apiReq);
  //   const jwtString = await apiRes.text();

  //   const [user] = await validateJwtAuthToken(jwtString, JWT_SECRET);

  //   return user;
  // }
  // TODO: Rewrite with rxjs to promise-first-nonNull
  const accessToken = (
    await Promise.all([
      //
      getAccessTokenFromCookie(request),
      getAccessTokenFromAuthHeader(request),
    ])
  ).filter(Boolean)[0];

  if (!accessToken) {
    return null;
  }

  const user = await firstValueFrom(
    merge(
      from(validateJwtAuthToken(accessToken, JWT_SECRET)),
      from(validateJwtAuthToken(accessToken, YA_OAUTH_CLIENT_SECRET)),
    ).pipe(
      map(([user]) => user),
      filter((user) => !!user),
      endWith(null),
    ),
  );

  return user;
}
