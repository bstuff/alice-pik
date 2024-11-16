import { useSuspenseQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { PikIntercomCard } from './PikIntercomCard';
import { pikRelaysQuery, pikStoredRelaysQuery } from './pikIntercomsQuery';

export const PikIntercoms: FC = () => {
  const data = useSuspenseQuery(pikRelaysQuery()).data;
  const storedRelays = useSuspenseQuery(pikStoredRelaysQuery()).data;

  return (
    <div className="relative">
      <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-4">
        {data.relays.map((it) => (
          <PikIntercomCard
            key={it.id}
            relayId={it.id}
            name={it.name}
            address={it.property_geo_units[0]?.post_name}
            isExported={storedRelays.storedRelays.map((r) => r.id).includes(it.id)}
          />
        ))}
      </div>

      {false && (
        <div className="sticky bottom-0 col-span-full flex h-0 w-full justify-end">
          <div className="">
            <button className="btn btn-primary btn-md -translate-y-full">button</button>
          </div>
        </div>
      )}
    </div>
  );
};
