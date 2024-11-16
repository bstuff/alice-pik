import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { getApi } from '~/utils/Api';
import { pikStoredRelaysQuery } from './pikIntercomsQuery';

type PikIntercomCardProps = {
  relayId: number;
  name: string;
  address?: string;
  isExported: boolean;
};
export const PikIntercomCard: FC<PikIntercomCardProps> = (props) => {
  const { relayId, name, address, isExported } = props;
  const [openResult, setOpenResult] = useState<Nullable<boolean>>(null);
  const unlockMutation = useMutation({
    async mutationFn() {
      return getApi().post('/api/services/pik/unlock', {
        body: JSON.stringify({ relayId }),
      });
    },
    onSuccess() {
      setOpenResult(true);
    },
    onError() {
      setOpenResult(false);
    },
  });

  useEffect(() => {
    if (openResult === null) {
      return;
    }
    const timeout = setTimeout(() => setOpenResult(null), 3000);
    return () => clearTimeout(timeout);
  }, [openResult]);

  const queryClient = useQueryClient();
  const addMutation = useMutation({
    async mutationFn() {
      return getApi().post('/api/services/pik/add-relay', {
        body: JSON.stringify({ id: relayId }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: pikStoredRelaysQuery.key });
    },
  });

  const removeMutation = useMutation({
    async mutationFn() {
      return getApi().post('/api/services/pik/remove-relay', {
        body: JSON.stringify({ id: relayId }),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: pikStoredRelaysQuery.key });
    },
  });

  return (
    <div
      className={twMerge(
        'card',
        openResult === true && 'shadow-md shadow-success outline outline-success',
      )}
    >
      <div className="card-body">
        <div className="card-title">{name}</div>
        <div className="flex gap-2">
          <div>ad: </div>
          <div>{address}</div>
        </div>
        <div className="flex gap-2">
          <div>id:</div>
          <div>{relayId}</div>
        </div>
      </div>
      <div className="card-actions">
        <button
          className={twMerge(
            'btn btn-primary btn-xs',
            openResult === true && 'disabled btn-success',
            openResult === false && 'disabled btn-error',
          )}
          onClick={unlockMutation.mutate as Any}
        >
          open {unlockMutation.isPending && <span className="loading loading-bars" />}
        </button>
        <button
          className={twMerge(
            'btn btn-primary btn-xs',
            isExported === true && 'btn-error',
            isExported === false && 'btn-success',
          )}
          onClick={(isExported ? removeMutation.mutate : addMutation.mutate) as () => Any}
          title="add to yandex home"
        >
          {isExported ? 'remove' : 'add'}
        </button>
      </div>
    </div>
  );
};
