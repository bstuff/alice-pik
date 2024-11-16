import { useSuspenseQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { pikTokenQuery } from './pikPageQuery';

export const RenderToken: FC = () => {
  const token = useSuspenseQuery(pikTokenQuery())
    .data.token?.split('.')
    .map((it, idx) => {
      if (idx === 1) {
        return (
          <span key={idx} className="blur hover:blur-0">
            {it}
          </span>
        );
      }
      return <span key={idx}>{it}</span>;
    });

  return (
    <pre>
      {...(token || []).flatMap((it, idx) => {
        return idx ? ['.', it] : it;
      })}
    </pre>
  );
};
