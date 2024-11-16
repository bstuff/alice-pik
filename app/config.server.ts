export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const YA_OAUTH_CLIENT_SECRET = process.env.YA_OAUTH_CLIENT_SECRET || '';
export const JWT_TTL = 30 * 24 * 60 * 60; // one month
export const ENABLE_DEBUG_HEADER = 'x-vs-debug';
export const ENABLE_DEBUG_QUERY_PARAM = '_vs-debug';
export const ENABLE_DEBUG_COOKIE = 'vs-debug';
