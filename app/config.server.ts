export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const YA_OAUTH_CLIENT_SECRET = process.env.YA_OAUTH_CLIENT_SECRET || '';
export const OAUTH_CLIENT_ID = process.env.YA_OAUTH_CLIENT_ID || '';
export const OAUTH_CLIENT_SECRET = process.env.YA_OAUTH_CLIENT_SECRET || '';
export const JWT_TTL = 30 * 24 * 60 * 60; // one month
// export const JWT_TTL = 3 * 60; // 3min
export const JWT_REFRESH_TTL = 12 * 30 * 24 * 60 * 60; // one year
