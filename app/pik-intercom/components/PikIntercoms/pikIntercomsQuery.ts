import { SerializeFrom } from '@remix-run/cloudflare';
import type { loader } from '~/routes/api.services.pik.relays';
import type { loader as SavedRelaysLoader } from '~/routes/api.services.pik.stored-relays';
import { getApi } from '~/utils/Api';
import { createQuery } from '~/utils/react-query';

export const pikRelaysQuery = createQuery<SerializeFrom<typeof loader>, void>(
  //
  ['services', 'pik', 'PikIntercoms', 'relays'] as const,
  ({ signal }) => {
    return getApi().get('/api/services/pik/relays', {
      signal,
    });
  },
);

export const pikStoredRelaysQuery = createQuery<SerializeFrom<typeof SavedRelaysLoader>, void>(
  //
  ['services', 'pik', 'PikIntercoms', 'stored-relays'] as const,
  ({ signal }) => {
    return getApi().get('/api/services/pik/stored-relays', {
      signal,
    });
  },
);
