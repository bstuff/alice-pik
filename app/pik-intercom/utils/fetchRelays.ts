import { concatMap, filter, first, firstValueFrom, from, map, mergeMap, of, toArray } from 'rxjs';
import { COMMON_PIK_HEADERS } from './commonHeaders';
import { PikIntercom, PikPagination, PikRelay } from './types';

export async function fetchRelays(pikToken: string) {
  const relays$ = from(
    (async () => {
      const headReq = new Request(`https://iot.rubetek.com/api/alfred/v1/personal/intercoms`, {
        method: 'HEAD',
        headers: {
          accept: 'application/json',
          authorization: pikToken,
          ...COMMON_PIK_HEADERS,
        },
      });
      return fetch(headReq);
    })(),
  ).pipe(
    map((it) => JSON.parse(it.headers.get('x-pagination') ?? 'null') as Nullable<PikPagination>),
    filter((it) => it !== null),
    map((it) => Math.min(it.pages, 10)),
    concatMap((it) => of(...Array.from(Array(it)).map((_, idx) => idx + 1))),
    mergeMap((page) => {
      const headReq = new Request(
        `https://iot.rubetek.com/api/alfred/v1/personal/intercoms?page=${page}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: pikToken,
            ...COMMON_PIK_HEADERS,
          },
        },
      );
      return from(fetch(headReq).then((res) => res.json<PikIntercom[]>()));
    }, 4),
    mergeMap((intercoms) => from(intercoms)),
    mergeMap((intercom) => from(intercom.relays)),
    toArray(),
    first((it) => !!it, [] as PikRelay[]),
  );

  return await firstValueFrom<PikRelay[]>(relays$);
}
