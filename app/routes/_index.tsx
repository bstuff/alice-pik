import { Link } from '@remix-run/react';
import { ContentContainer } from '~/components/ContentContainer';
import { Header } from '~/components/Header';
import { routes } from '~/utils/routes';
import { useRootLoaderData } from '~/utils/useRootLoaderData';

export default function Index() {
  const { user } = useRootLoaderData();

  return (
    <>
      <Header />
      <div className="min-h-screen w-full overflow-hidden pt-4">
        <ContentContainer>
          <div>hi</div>
          {/* {user && <pre>{JSON.stringify(user, null, 2)}</pre>} */}
          <Link
            className="btn btn-primary mt-4"
            to={
              user ? routes.services.pik() : routes.login({}, { redirect: routes.services.pik() })
            }
          >
            {'К сервисам ->'}
          </Link>
        </ContentContainer>
      </div>
    </>
  );
}
