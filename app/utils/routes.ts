import { createRouting, query, segment } from 'ts-routes';

export const routes = createRouting({
  alice: {
    ...segment`/alice/v1.0`,
    children: {
      // user: segment`/browse/${arg('toolId')}`,
      user: {
        ...segment`/user`,
        children: {
          devices: {
            ...segment`/devices`,
            children: {
              action: segment`/action`,
              query: segment`/query`,
            },
          },
          unlink: segment`/unlink`,
        },
      },
    },
  },
  login: {
    ...segment`/login`,
    query: {
      redirect: query('optional'),
    },
  },
  services: {
    ...segment`/services`,
    children: {
      pik: {
        ...segment`/pik`,
        children: {
          addUser: segment`/add-user`,
        },
      },
    },
  },
});

export function patternToRemixId(pattern: string) {
  return `routes/${pattern.replaceAll('/', '.').replaceAll(':', '$').slice(1)}`;
}
