/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString, { StringifiableRecord } from 'query-string';

export class Api {
  public baseUrl = '';
  public readonly headers = new Headers([]);

  async get<T = any, P extends StringifiableRecord = StringifiableRecord>(
    url: string,
    init?: RequestInit & { params?: P },
  ): Promise<T> {
    const nextUrl = queryString.stringifyUrl(
      { url, query: init?.params },
      { arrayFormat: 'comma' },
    );

    return await this.fetch<T>(nextUrl, init);
  }

  async post<T = any, P extends StringifiableRecord = StringifiableRecord>(
    url: string,
    init?: RequestInit & { params?: P },
  ): Promise<T> {
    const nextUrl = queryString.stringifyUrl(
      { url, query: init?.params },
      { arrayFormat: 'comma' },
    );

    return await this.fetch<T>(nextUrl, {
      ...init,
      method: 'POST',
      headers: {
        ...init?.headers,
        'content-type': 'application/json',
      },
    });
  }

  async delete<T = any, P extends StringifiableRecord = StringifiableRecord>(
    url: string,
    init?: RequestInit & { params?: P },
  ): Promise<T> {
    const nextUrl = queryString.stringifyUrl(
      { url, query: init?.params },
      { arrayFormat: 'comma' },
    );

    return await this.fetch<T>(nextUrl, {
      ...init,
      method: 'DELETE',
      headers: init?.headers,
    });
  }

  async fetch<T = any>(input: RequestInfo & string, init?: RequestInit<RequestInitCfProperties>) {
    const res = await fetch(this.baseUrl + input, {
      ...init,
      headers: {
        ...Object.fromEntries(this.headers.entries()),
        ...init?.headers,
      },
    });

    if (res.status > 399) {
      const nextError = new HttpError(res);
      try {
        const errorData = await res.json<{ message: string; code: string }>();
        nextError.message = errorData.message;
        nextError.code = errorData.code;
      } catch (err) {
        //
      }
      throw nextError;
    }

    return await res.json<T>();
  }
}

export class HttpError extends Error {
  name = 'HttpError';
  status: number;
  code?: string;

  constructor(res: Pick<Response, 'statusText' | 'status'>) {
    // super(`[HTTP ${res.status}] ${res.statusText}: ${res.url}`);
    super(res.statusText);

    this.status = res.status;
  }
}

let api: Api;

export function getApi() {
  if (!api) {
    api = new Api();
  }

  return api;
}
