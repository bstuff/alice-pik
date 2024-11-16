import { QueryFunction, QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { StringifiableRecord } from 'query-string';

export function createQuery<
  TData = unknown,
  P extends StringifiableRecord | void = StringifiableRecord,
>(queryKey: QueryKey, queryFn: QueryFunction<TData, readonly [P]>) {
  function q(params: P) {
    return {
      queryKey: queryKey.concat(params) as unknown as readonly [P],
      queryFn: queryFn,
    };
  }
  q.key = queryKey;

  return q;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaulQueryOptions<T extends (arg: any) => { queryFn: any }> = Omit<
  UseQueryOptions<
    Awaited<ReturnType<ReturnType<T>['queryFn']>>,
    Error,
    Awaited<ReturnType<ReturnType<T>['queryFn']>>,
    readonly [Parameters<T>[0]]
  >,
  'queryFn' | 'queryKey'
>;
