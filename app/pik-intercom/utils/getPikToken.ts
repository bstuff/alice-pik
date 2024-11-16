import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { getUser } from '~/utils/auth';
import { getTokenKvKey } from './kvKeys';

const KEY_GET_TOKEN = Symbol('getPikToken');

export async function getPikToken({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'context' | 'request'>): Promise<string | null> {
  const r = context as { [KEY_GET_TOKEN]?: ReturnType<typeof getPikTokenImpl> };

  return await (r[KEY_GET_TOKEN] ?? (r[KEY_GET_TOKEN] = getPikTokenImpl({ request, context })));
}

async function getPikTokenImpl({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'context' | 'request'>): Promise<string | null> {
  const user = await getUser({ request, context });
  if (!user) {
    return null;
  }

  return await context.env.USERS.get(getTokenKvKey(user.uid));
}
