import { ActionFunction, json, TypedResponse } from '@remix-run/cloudflare';
import { JWT_SECRET, JWT_TTL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from '~/config.server';
import { generateAuthToken, generateRefreshToken, validateJwtAuthToken } from '~/utils/auth';

export type RequestBody = {
  // refresh_token: string;
  // client_id: string;
  // client_secret: string;
  // grant_type: 'refresh_token';
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
  error: 'invalid_refresh_token' | 'invalid_grant_type' | '';
  error_description?: string;
};

export const action = (async ({ request }): Promise<TypedResponse<ResponseType>> => {
  const body = await request.text();
  const params = new URLSearchParams(body);
  // console.log(body);

  const refreshToken = params.get('refresh_token') ?? '';
  const clientId = params.get('client_id') ?? '';
  const clientSecret = params.get('client_secret');
  const grantType = params.get('grant_type');

  // Validate the 'grant_type' to be 'authorization_code'
  if (grantType !== 'refresh_token') {
    throw json(
      {
        error: 'invalid_grant_type',
        error_description: 'The grant_type must be "refresh_token".',
      },
      400,
    );
  }

  // Fetch the stored authorization code and validate it
  const [storedUser] = await validateJwtAuthToken(refreshToken, JWT_SECRET);
  if (!storedUser) {
    throw json(
      {
        error: 'invalid_refresh_token',
        error_description: 'The provided refresh_token is invalid or has expired.',
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
  const [accessToken, new_refreshToken] = await Promise.all([
    generateAuthToken(storedUser),
    generateRefreshToken(storedUser),
  ]);

  return json({
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: JWT_TTL,
    refresh_token: new_refreshToken,
    // scope: 'read write', // Example scope, adjust based on your needs
  });
}) satisfies ActionFunction;

function getClient(clientId: string) {
  if (clientId === OAUTH_CLIENT_ID) {
    return {
      clientId,
      clientSecret: OAUTH_CLIENT_SECRET,
    };
  }
  return null;
}
