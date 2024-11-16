import { createCookie } from '@remix-run/cloudflare';

export const accessTokenCookie = createCookie('access_token', {
  maxAge: 30 * 24 * 60 * 60 * 365, // one year
  httpOnly: true,
});
