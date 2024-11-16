import { Link } from '@remix-run/react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { FC, Suspense, useState } from 'react';
import { ContentContainer } from '~/components/ContentContainer';
import { getApi } from '~/utils/Api';
import { routes } from '~/utils/routes';
import { PikIntercoms } from '../PikIntercoms/PikIntercoms';
import { pikTokenQuery } from './pikPageQuery';
import { RenderToken } from './RenderToken';

export const PikPage: FC = () => {
  const queryClient = useQueryClient();
  const token = useSuspenseQuery(pikTokenQuery()).data.token;
  const deleteTokenMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn(_?: Any) {
      return getApi().delete('/api/services/pik/token');
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: pikTokenQuery.key });
    },
  });

  const [isAllintercomsShown, setIsAllIntercomsShown] = useState(false);

  return (
    <ContentContainer>
      <h1 className="text-center text-[44px] font-bold">Pik service</h1>

      <div>Token info:</div>
      <RenderToken />
      <div className="my-2 flex gap-2">
        {!token && (
          <Link className="btn btn-sm" to={routes.services.pik.addUser()}>
            add
          </Link>
        )}
        {!!token && (
          <button
            className="btn btn-error btn-sm"
            onClick={deleteTokenMutation.mutate}
            disabled={!deleteTokenMutation.isIdle}
          >
            delete
          </button>
        )}
      </div>

      {!!token && (
        <div className="mt-8">
          <div className="mb-4">Pik Intercoms:</div>

          {isAllintercomsShown ? (
            <Suspense fallback="loading...">
              <PikIntercoms />
            </Suspense>
          ) : (
            <button className="btn btn-accent btn-sm" onClick={() => setIsAllIntercomsShown(true)}>
              Fetch all relays
            </button>
          )}
        </div>
      )}

      <div className="min-h-10" />
    </ContentContainer>
  );
};
