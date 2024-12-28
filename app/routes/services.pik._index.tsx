import { LoaderFunction } from '@remix-run/cloudflare';
import { Header } from '~/components/Header';
import { PikPage } from '~/pik-intercom/components/PikPage/PikPage';
import { getUser } from '~/utils/auth';
import { ClientOnly } from '~/utils/ClientOnly';

export const loader = (async ({ request, context }) => {
  const user = await getUser({ request, context });
  if (!user) {
    throw new Response(null, { status: 401 });
  }

  context.posthog.capture({
    event: '$pageview',
    distinctId: `ya:${user.uid}`,
    properties: {
      $current_url: '/services/pik',
    },
  });

  return null;
}) satisfies LoaderFunction;

export default function PikPage1() {
  return (
    <>
      <Header />
      <div className="w-full overflow-hidden pt-4">
        <ClientOnly>
          <PikPage />
        </ClientOnly>
      </div>
    </>
  );
}
