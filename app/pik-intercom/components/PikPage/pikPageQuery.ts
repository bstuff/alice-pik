import { getApi } from '~/utils/Api';
import { createQuery } from '~/utils/react-query';
import type { loader } from '~/routes/api.services.pik.token';
import { SerializeFrom } from '@remix-run/cloudflare';

export const pikTokenQuery = createQuery<SerializeFrom<typeof loader>, void>(
  //
  ['services', 'pik', 'token'] as const,
  ({ signal }) => {
    return getApi().get('/api/services/pik/token', {
      signal,
    });
  },
);
