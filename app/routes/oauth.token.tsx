import { ActionFunction, AppLoadContext, json, TypedResponse } from '@remix-run/cloudflare';
import { JWT_TTL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from '~/config.server';
import { generateAuthToken, generateRefreshToken, getUser } from '~/utils/auth';
import { oauthCodeKvKey } from '~/utils/oauth';

export type RequestBody = {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType: string;
};

type ResponseType = SuccessResponseType | ErrorResponseType;
type SuccessResponseType = {
  access_token: string;
  /** Yandex anyway will send header starting with 'Bearer ...', so use bearer */
  token_type: 'bearer' | 'jwt';
  /** in seconds */
  expires_in: number;
  refresh_token: string;
  scope?: string; // Example scope, adjust based on your needs
};

type ErrorResponseType = {
  error: 'invalid_code' | 'invalid_grant_type' | '';
  error_description?: string;
};

export const action = (async ({ request, context }): Promise<TypedResponse<ResponseType>> => {
  const body = await request.text();
  const params = new URLSearchParams(body);
  // console.log(body);

  const code = params.get('code') ?? '';
  const clientId = params.get('client_id') ?? '';
  const clientSecret = params.get('client_secret');
  const redirectUri = params.get('redirect_uri') ?? '';
  const grantType = params.get('grant_type');

  // Validate the 'grant_type' to be 'authorization_code'
  if (grantType !== 'authorization_code') {
    throw json(
      {
        error: 'invalid_grant_type',
        error_description: 'The grant_type must be "authorization_code".',
      },
      400,
    );
  }

  // Fetch the stored authorization code and validate it
  const storedUser = await validateCode(context, code, clientId, redirectUri);
  if (!storedUser) {
    throw json(
      {
        error: 'invalid_code',
        error_description: 'The provided authorization code is invalid or has expired.',
      },
      400,
    );
  }

  // Check if the client_id and client_secret match
  const client = await getClient(clientId!);
  if (!client || client.clientSecret !== clientSecret) {
    throw json(
      {
        error: 'invalid_client',
        error_description: 'Client authentication failed.',
      },
      400,
    );
  }

  // Generate an access token and possibly a refresh token
  const [accessToken, refreshToken] = await Promise.all([
    generateAuthToken(storedUser),
    generateRefreshToken(storedUser),
  ]);

  return json({
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: JWT_TTL,
    refresh_token: refreshToken,
    // scope: 'read write', // Example scope, adjust based on your needs
  });
}) satisfies ActionFunction;

async function validateCode(
  context: AppLoadContext,
  code: string,
  clientId: string,
  _redirectUri: string,
) {
  _redirectUri;
  const kvKey = oauthCodeKvKey(code);
  const storedData = JSON.parse((await context.env.USERS.get(kvKey)) ?? '{}') as {
    user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
    clientId: string;
  };
  context.waitUntil(context.env.USERS.delete(kvKey));

  if (storedData.clientId !== clientId) {
    return false;
  }

  return storedData.user;
}

function getClient(clientId: string) {
  if (clientId === OAUTH_CLIENT_ID) {
    return {
      clientId,
      clientSecret: OAUTH_CLIENT_SECRET,
    };
  }
  return null;
}
