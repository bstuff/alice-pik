import { LoaderFunction, json } from '@remix-run/cloudflare';
import { ContentContainer } from '~/components/ContentContainer';
import { routes } from '~/utils/routes';
import { getUser } from '~/utils/auth';

export const loader = (async ({ request, context }) => {
  const user = await getUser({ request, context });
  
  if (user) {
    context.posthog.capture({
      event: '$pageview',
      distinctId: `ya:${user.uid}`,
      properties: {
        $current_url: '/profile',
      },
    });
  }

  return json(null);
}) satisfies LoaderFunction;

export default function ProfilePage() {
  return (
    <ContentContainer>
      <h1 className="pt-10 text-center text-2xl">Profile</h1>
      <form action={routes.logout()} method="POST">
        <button className="align-self-end btn btn-primary btn-md" type="submit">
          Logout
        </button>
      </form>
    </ContentContainer>
  );
}
