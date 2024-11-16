import { Link } from '@remix-run/react';
import { FC } from 'react';
import { routes } from '~/utils/routes';
import { useRootLoaderData } from '~/utils/useRootLoaderData';

export const Header: FC = () => {
  const { user } = useRootLoaderData();

  return (
    <div className="flex w-full items-center justify-between gap-2 px-8 py-2 shadow shadow-base-content">
      <div className="text-2xl font-black">Домофон</div>
      <div className="flex-1" />
      {user ? (
        <div className="text-lg font-medium">{user.display_name}</div>
      ) : (
        <Link className="btn btn-neutral btn-sm sm:btn-md" to={routes.login()}>
          Login
        </Link>
      )}
    </div>
  );
};
