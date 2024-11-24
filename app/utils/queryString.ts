import queryString from 'query-string';

export function getQueryParams<T extends Record<string, unknown>>(url: string): T {
  const params = queryString.parseUrl(url, { arrayFormat: 'comma' }).query;

  return params as unknown as T;
}
