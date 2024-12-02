import { ContentContainer } from '~/components/ContentContainer';
import { routes } from '~/utils/routes';

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
